import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, MoreThan, Not, Repository } from "typeorm";
import { Announcement } from "./entities/announcement.entity";
import { AnnouncementStatus } from "src/types/announcement";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";
import { DeliveriesService } from "../deliveries/deliveries.service";

export interface UpdateAnnouncementDto {
  title?: string;
  description?: string;
  departure_city?: string;
  arrival_city?: string;
  price?: number;
  pickup_date?: Date;
  delivery_date?: Date;
  assurance?: boolean;
  urgent?: boolean;
  pickup_instructions?: string;
  status?: AnnouncementStatus;
}

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
    @Inject(forwardRef(() => DeliveriesService))
    private readonly deliveriesService: DeliveriesService
  ) {}

  async create(
    customerId: number,
    createAnnouncementDto: CreateAnnouncementDto
  ) {
    const { objects, ...announcementData } = createAnnouncementDto;

    const createdAnnouncement = await this.insertOne({
      title: announcementData.title,
      description: announcementData.description,
      price: announcementData.price,
      assurance: announcementData.assurance ?? false,
      urgent: announcementData.urgent ?? false,
      customer_id: customerId,
      departure_city: announcementData.departureCity,
      arrival_city: announcementData.arrivalCity,
      pickup_date: announcementData.pickupDate,
      delivery_date: announcementData.deliveryDate,
      pickup_instructions: announcementData.pickupInstructions,
    });

    await this.deliveriesService.createDeliveryWithPackages(
      createdAnnouncement.id,
      objects
    );
  }

  /* Db Requests */

  async insertOne(
    announcementToCreate: Pick<
      Announcement,
      | "title"
      | "description"
      | "departure_city"
      | "arrival_city"
      | "price"
      | "pickup_date"
      | "delivery_date"
      | "assurance"
      | "urgent"
      | "pickup_instructions"
      | "customer_id"
    >
  ) {
    const announcement =
      this.announcementRepository.create(announcementToCreate);
    return this.announcementRepository.save(announcement);
  }

  async findAll(): Promise<Announcement[]> {
    return await this.announcementRepository.find({
      relations: ["customer", "deliveries"],
      order: { created_at: "DESC" },
    });
  }

  async findOne(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ["customer", "deliveries"],
    });

    if (!announcement) {
      throw new Error(`Announcement with ID ${id} not found`);
    }

    return announcement;
  }

  async findFuturesByCustomer(customerId: number): Promise<Announcement[]> {
    return await this.announcementRepository.find({
      where: {
        customer_id: customerId,
        delivery_date: MoreThan(new Date()),
        status: Not(AnnouncementStatus.CANCELLED),
      },
      relations: ["customer", "deliveries"],
      order: { created_at: "DESC" },
    });
  }

  async findPastByCustomer(customerId: number): Promise<Announcement[]> {
    return await this.announcementRepository.find({
      where: [
        {
          customer_id: customerId,
          delivery_date: LessThan(new Date()),
          status: AnnouncementStatus.CANCELLED,
        },
        { customer_id: customerId, status: AnnouncementStatus.DELIVERED },
      ],
      relations: ["customer", "deliveries"],
      order: { created_at: "DESC" },
    });
  }

  async findByStatus(status: AnnouncementStatus): Promise<Announcement[]> {
    return await this.announcementRepository.find({
      where: { status },
      relations: ["customer", "deliveries"],
      order: { created_at: "DESC" },
    });
  }

  async update(
    id: number,
    updateAnnouncementDto: UpdateAnnouncementDto
  ): Promise<Announcement> {
    const announcement = await this.findOne(id);

    Object.assign(announcement, updateAnnouncementDto);

    return await this.announcementRepository.save(announcement);
  }

  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementRepository.remove(announcement);
  }

  async updateStatus(
    id: number,
    status: AnnouncementStatus
  ): Promise<Announcement> {
    return await this.update(id, { status });
  }

  async findManyByConditions(conditions: any): Promise<Announcement[]> {
    return this.announcementRepository.find({
      where: conditions,
      relations: ["customer", "deliveries"],
    });
  }
}
