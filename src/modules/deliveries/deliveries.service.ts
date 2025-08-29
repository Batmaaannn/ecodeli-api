import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, In } from "typeorm";
import { UpdateDeliveryDto } from "./dto/update-delivery.dto";
import { Delivery } from "./entities/delivery.entity";
import { Package } from "./entities/package.entity";
import { ObjectDto } from "../announcements/dto/create-announcement.dto";
import { generateTrackingCode } from "src/utils/tracking";
import slugify from "slugify";
import { convertToMulterFile } from "src/utils/file-storage/convert";
import { processFile, getFileSignedUrl } from "src/utils/file-storage/s3";
import { Route } from "./entities/route.entity";
import { AnnouncementStatus } from "src/types/announcement";
import { DeliveryStatus, DeliveryType } from "src/types/delivery";
import { DeliveryAgentsService } from "../delivery-agents/delivery-agents.service";
import { AnnouncementsService } from "../announcements/announcements.service";
import { CreateRouteDto } from "./dto/create-route.dto";
import config from "src/config";

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveriesRepository: Repository<Delivery>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    private readonly deliveryAgentService: DeliveryAgentsService,
    @Inject(forwardRef(() => AnnouncementsService))
    private readonly announcementService: AnnouncementsService
  ) {}

  // Deliveries

  async createDeliveryWithPackages(
    announcementId: number,
    objects: ObjectDto[]
  ): Promise<Delivery> {
    const trackingCode = generateTrackingCode();

    const delivery = this.deliveriesRepository.create({
      announcement_id: announcementId,
      tracking_code: trackingCode,
    });

    const savedDelivery = await this.deliveriesRepository.save(delivery);

    for (const object of objects) {
      const file = convertToMulterFile(object.photo);

      const fileNameSlugified = slugify(file.originalname, {
        lower: true,
      });

      const fileFullPath = `announcements/${announcementId}/${fileNameSlugified}`;

      await processFile(fileFullPath, file, announcementId.toString());

      const packageEntity = this.packageRepository.create({
        photos: fileFullPath,
        delivery_id: savedDelivery.id,
        weight: object.weight,
        length: object.length,
        width: object.width,
        height: object.height,
        quantity: object.quantity,
        fragile: object.fragile,
      });

      await this.packageRepository.save(packageEntity);
    }

    return savedDelivery;
  }

  async assignDeliveriesToAgent(
    updateDeliveryDto: UpdateDeliveryDto[],
    userId: number
  ) {
    const deliveryAgent =
      await this.deliveryAgentService.findOneByIdWithAllRelations(userId);

    if (!deliveryAgent) {
      throw new HttpException("Delivery agent not found", HttpStatus.NOT_FOUND);
    }
  
    const deliveries = await this.deliveriesRepository.find({
      where: { id: In(updateDeliveryDto.map((dto) => dto.deliveryId)) },
      relations: ["announcement", "packages"],
    });


    const results = [];

    for (const dto of updateDeliveryDto) {
      const delivery = deliveries.find((d) => d.id === dto.deliveryId);

      if (!delivery) {
        results.push({
          deliveryId: dto.deliveryId,
          error: "Delivery not found",
        });
        continue;
      }

      if (delivery.delivery_agent_id) {
        results.push({
          deliveryId: delivery.id,
          error: "Delivery is already assigned to another agent",
        });
        continue;
      }

      if (delivery.status !== DeliveryStatus.PENDING) {
        results.push({
          deliveryId: delivery.id,
          error: "Delivery is not available for assignment",
        });
        continue;
      }

      if (delivery.announcement.status !== AnnouncementStatus.POSTED) {
        results.push({
          deliveryId: delivery.id,
          error: "Announcement is no longer available",
        });
        continue;
      }


      // Handle partial delivery - create a new delivery and update original
      if (dto.type === DeliveryType.PARTIAL && dto.intermediateCity) {
        // First, update the original delivery to be partial (from origin to intermediate city)
        delivery.delivery_agent_id = deliveryAgent.id;
        delivery.status = DeliveryStatus.ASSIGNED;
        delivery.delivery_type = DeliveryType.PARTIAL;
        delivery.intermediate_city = dto.intermediateCity;

        await this.deliveriesRepository.save(delivery);

        // Create a new delivery for the second part (from intermediate city to final destination)
        const newDelivery = this.deliveriesRepository.create({
          delivery_type: DeliveryType.PARTIAL,
          tracking_code: generateTrackingCode(),
          status: DeliveryStatus.PENDING, // Still pending as no one assigned yet
          announcement_id: delivery.announcement_id,
          intermediate_city: dto.intermediateCity, // This delivery starts from intermediate city
        });

        const savedDelivery = await this.deliveriesRepository.save(newDelivery);

        // Packages should already be loaded from the relation above

        // Copy packages to the new partial delivery
        if (delivery.packages && delivery.packages.length > 0) {
          for (const originalPackage of delivery.packages) {
            const newPackage = this.packageRepository.create({
              weight: originalPackage.weight,
              length: originalPackage.length,
              width: originalPackage.width,
              height: originalPackage.height,
              quantity: originalPackage.quantity,
              photos: originalPackage.photos,
              fragile: originalPackage.fragile,
              delivery_id: savedDelivery.id,
            });
            await this.packageRepository.save(newPackage);
          }
        }

        results.push({
          deliveryId: delivery.id,
          newDeliveryId: savedDelivery.id,
          type: DeliveryType.PARTIAL,
          intermediateCity: dto.intermediateCity,
          status: DeliveryStatus.ASSIGNED,
          description: `Partial delivery assigned from origin to ${dto.intermediateCity}. New delivery created for ${dto.intermediateCity} to destination.`,
        });
      } else {
        // Handle full delivery - update existing delivery
        delivery.delivery_agent_id = deliveryAgent.id;
        delivery.status = DeliveryStatus.ASSIGNED;
        delivery.delivery_type = DeliveryType.FULL;

        await this.deliveriesRepository.save(delivery);

        results.push({
          deliveryId: delivery.id,
          type: DeliveryType.FULL,
          status: DeliveryStatus.ASSIGNED,
        });
      }
    }

    return results;
  }

  async getDelivery(id: number) {
    const delivery = await this.findOneByAnnouncementId(id);
    if (!delivery)
      return new HttpException("Delivery not found", HttpStatus.NOT_FOUND);

    if (delivery.packages && delivery.packages.length > 0) {
      for (const pkg of delivery.packages) {
        if (pkg.photos) {
          try {
            // Generate signed URL from the stored file path
            pkg.photos = await getFileSignedUrl(
              pkg.photos,
              config.storage.bucket
            );
          } catch (error) {
            console.error(
              `Error generating signed URL for package ${pkg.id}:`,
              error
            );
            // Keep the original path if URL generation fails
          }
        }
      }
    }

    return delivery;
  }

  async findPastDeliveries(id: number) {
    const pastDeliveries = await this.deliveriesRepository.find({
      where: {
        delivery_agent_id: id,
        status: DeliveryStatus.DELIVERED,
      },
      relations: ["announcement", "ratings", "packages"],
    });
    return pastDeliveries;
  }

  // Routes
  async getRoutesByAgentId(id: number) {
    return this.findRoutesByAgentId(id);
  }

  async createRoute(createRouteDto: CreateRouteDto, userId: number) {
    const {
      departureCity,
      arrivalCity,
      departureDate,
      arrivalDate,
      maxPackages,
    } = createRouteDto;

    const deliveryAgent =
      await this.deliveryAgentService.findOneByIdWithAllRelations(userId);

    if (!deliveryAgent) {
      throw new HttpException("Delivery agent not found", HttpStatus.NOT_FOUND);
    }

    const route = this.routeRepository.create({
      departure_city: departureCity,
      arrival_city: arrivalCity,
      departure_date: departureDate,
      arrival_date: arrivalDate,
      max_packages: maxPackages,
      delivery_agent_id: deliveryAgent.id,
    });

    return this.routeRepository.save(route);
  }

  async deleteRouteById(id: number) {
    const route = await this.findOneRoute(id);
    if (!route) {
      throw new HttpException("Route not found", HttpStatus.NOT_FOUND);
    }

    return this.routeRepository.remove(route);
  }

  /* Db Requests */
  async findAll() {
    return this.deliveriesRepository.find({ relations: ["customer"] });
  }

  async findAvailableDeliveries(agentId: number, city?: string, maxRadius?: number) {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Build the query with delivery as base entity and join announcement
    const queryBuilder = this.deliveriesRepository
      .createQueryBuilder('delivery')
      .leftJoinAndSelect('delivery.announcement', 'announcement')
      .leftJoinAndSelect('delivery.packages', 'packages')
      .where('delivery.status = :status', { status: DeliveryStatus.PENDING })
      .andWhere('delivery.delivery_agent_id IS NULL')
      .andWhere('announcement.status = :announcementStatus', { 
        announcementStatus: AnnouncementStatus.POSTED 
      })
      .andWhere('announcement.pickup_date BETWEEN :now AND :sevenDaysFromNow', {
        now,
        sevenDaysFromNow
      });

    // Add city filter if provided
    if (city) {
      queryBuilder.andWhere('announcement.departure_city ILIKE :city', { 
        city: `%${city}%` 
      });
    }

    const availableDeliveries = await queryBuilder.getMany();

    // Return deliveries with announcement data
    return availableDeliveries.map((delivery) => ({
      id: delivery.id,
      announcementId: delivery.announcement.id,
      trackingCode: delivery.tracking_code,
      status: delivery.status,
      deliveryType: delivery.delivery_type,
      intermediateCity: delivery.intermediate_city,
      title: delivery.announcement.title,
      description: delivery.announcement.description,
      departureCity: delivery.announcement.departure_city,
      arrivalCity: delivery.announcement.arrival_city,
      price: delivery.announcement.price,
      pickupDate: delivery.announcement.pickup_date,
      deliveryDate: delivery.announcement.delivery_date,
      urgent: delivery.announcement.urgent,
      assurance: delivery.announcement.assurance,
      pickupInstructions: delivery.announcement.pickup_instructions,
      packagesCount: delivery.packages?.length || 0,
    }));
  }

  async findOne(id: number) {
    return await this.deliveriesRepository.findOne({
      where: { id },
      relations: [
        "delivery_agent",
        "packages",
        "announcement",
        "announcement.customer",
      ],
    });
  }

  async findOneByAnnouncementId(announcementId: number) {
    return await this.deliveriesRepository.findOne({
      where: { announcement: { id: announcementId } },
      relations: [
        "delivery_agent",
        "packages",
        "announcement",
        "announcement.customer",
      ],
    });
  }

  async findOneRoute(id: number) {
    return await this.routeRepository.findOne({
      where: { id },
    });
  }

  async findByIds(ids: number[]) {
    return await this.deliveriesRepository.find({
      where: { id: In(ids) },
      relations: ["announcement"],
    });
  }

  async findRoutesByAgentId(id: number) {
    return this.routeRepository.find({
      where: {
        delivery_agent_id: id,
      },
    });
  }

  async update(id: number, updateData: Partial<Delivery>) {
    const delivery = await this.deliveriesRepository.findOne({ where: { id } });
    if (!delivery) {
      throw new HttpException("Delivery not found", HttpStatus.NOT_FOUND);
    }
    Object.assign(delivery, updateData);
    return this.deliveriesRepository.save(delivery);
  }

  async remove(id: number) {
    const delivery = await this.findOne(id);
    if (!delivery) {
      throw new HttpException("Delivery not found", HttpStatus.NOT_FOUND);
    }

    return this.deliveriesRepository.remove(delivery);
  }
}
