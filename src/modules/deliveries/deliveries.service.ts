import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, MoreThanOrEqual, In } from "typeorm";
import { UpdateDeliveryDto } from "./dto/update-delivery.dto";
import { Delivery } from "./entities/delivery.entity";
import { Package } from "./entities/package.entity";
import { ObjectDto } from "../announcements/dto/create-announcement.dto";
import { generateTrackingCode } from "src/utils/tracking";
import slugify from "slugify";
import { convertToMulterFile } from "src/utils/file-storage/convert";
import { processFile } from "src/utils/file-storage/s3";
import { Route } from "./entities/route.entity";
import { DeliveryAgent } from "../delivery-agents/entities/delivery-agents.entity";
import { Announcement } from "../announcements/entities/announcement.entity";
import { AnnouncementStatus } from "src/types/announcement";
import { DeliveryStatus } from "src/types/delivery";
import { DeliveryAgentsService } from "../delivery-agents/delivery-agents.service";
import { AnnouncementsService } from "../announcements/announcements.service";
import { CreateRouteDto } from "./dto/create-route.dto";

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

    const deliveries = await this.findByIds(
      updateDeliveryDto.map((dto) => dto.deliveryId)
    );

    const results = [];
    for (const delivery of deliveries) {
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

      delivery.delivery_agent_id = deliveryAgent.id;
      delivery.status = DeliveryStatus.ASSIGNED;

      await this.deliveriesRepository.save(delivery);

      results.push({
        deliveryId: delivery.id,
        status: "assigned",
      });
    }

    return results;
  }

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

  async findAvailableDeliveries(id: number, city?: string, maxRadius?: number) {
    const deliveryAgent =
      await this.deliveryAgentService.findOneByIdWithAllRelations(id);

    // Calculate date range (now to now + 7 days)
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    // Build query conditions
    const whereConditions: any = {
      status: AnnouncementStatus.POSTED,
      pickup_date: Between(now, sevenDaysFromNow),
    };

    // Add city filter if provided
    if (city) {
      whereConditions.departure_city = city;
    }

    // Find available announcements
    const availableAnnouncements =
      await this.announcementService.findManyByConditions(whereConditions);

    // Filter announcements that don't have assigned deliveries or have pending deliveries
    const availableForDelivery = availableAnnouncements.filter(
      (announcement) => {
        // Check if all deliveries are still pending (not assigned to a delivery agent)
        return announcement.deliveries.every(
          (delivery) =>
            delivery.status === DeliveryStatus.PENDING &&
            !delivery.delivery_agent_id
        );
      }
    );

    // TODO: If radius filter is provided, we would need to implement distance calculation
    // This would require geocoding or storing coordinates for cities
    // For now, we'll return results based on city match only

    return availableForDelivery.map((announcement) => ({
      announcementId: announcement.id,
      title: announcement.title,
      description: announcement.description,
      departureCity: announcement.departure_city,
      arrivalCity: announcement.arrival_city,
      price: announcement.price,
      pickupDate: announcement.pickup_date,
      deliveryDate: announcement.delivery_date,
      urgent: announcement.urgent,
      assurance: announcement.assurance,
      pickupInstructions: announcement.pickup_instructions,
      customer: {
        firstName: announcement.customer.first_name,
        lastName: announcement.customer.last_name,
      },
      deliveries: announcement.deliveries.map((delivery) => ({
        id: delivery.id,
        trackingCode: delivery.tracking_code,
        status: delivery.status,
        deliveryType: delivery.delivery_type,
      })),
    }));
  }

  async findOne(id: number) {
    return await this.deliveriesRepository.findOne({
      where: { id },
      relations: ["customer", "deliveryAgent", "packages"],
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
