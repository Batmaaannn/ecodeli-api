import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDeliveryRequestDto } from "./dto/create-delivery-request.dto";
import { Delivery } from "./entities/delivery.entity";
import { Package } from "./entities/package.entity";
import { ObjectDto } from "../announcements/dto/create-announcement.dto";
import { generateTrackingCode } from "src/utils/tracking";
import slugify from "slugify";
import { convertToMulterFile } from "src/utils/file-storage/convert";
import { processFile } from "src/utils/file-storage/s3";
import { Route } from "./entities/route.entity";

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveriesRepository: Repository<Delivery>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Route) private routeRepository: Repository<Route>
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

  /* Db Requests */
  async findAll() {
    return this.deliveriesRepository.find({ relations: ["customer"] });
  }

  async findAllPosted() {
    // return this.deliveriesRepository.find({
    //   where: {
    //     announcement: {
    //       status: "POSTED"
    //     }
    //   },
    //   relations: ["customer", "deliveryAgent", "packages", "announcement"],
    // });
  }

  async findOne(id: number) {
    const delivery = await this.deliveriesRepository.findOne({
      where: { id },
      relations: ["customer", "deliveryAgent", "packages"],
    });
    if (!delivery) {
      throw new HttpException("Delivery not found", HttpStatus.NOT_FOUND);
    }
    return delivery;
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
    const delivery = await this.deliveriesRepository.findOne({ where: { id } });
    if (!delivery) {
      throw new HttpException("Delivery not found", HttpStatus.NOT_FOUND);
    }
    return this.deliveriesRepository.remove(delivery);
  }
}
