import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Announcement } from "./entities/annoucement.entity";
import { AnnouncementStatus } from "src/types/announcement";
import { CreateAnnouncementDto } from "./dto/create-announcement.dto";

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
    private announcementRepository: Repository<Announcement>
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto
  ): Promise<Announcement> {
    const announcement = this.announcementRepository.create(
      createAnnouncementDto
    );
    return await this.announcementRepository.save(announcement);
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

  async findByCustomer(customerId: number): Promise<Announcement[]> {
    return await this.announcementRepository.find({
      where: { customer_id: customerId },
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
}
