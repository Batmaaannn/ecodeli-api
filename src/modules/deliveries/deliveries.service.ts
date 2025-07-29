import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDeliveryRequestDto } from "./dto/create-delivery-request.dto";
import { Delivery } from "./entities/delivery.entity";

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveriesRepository: Repository<Delivery>
  ) {}

  async createWithFiles(
    body: any,
    files: Express.Multer.File[],
    customerId: number
  ) {
    let parsedObjects;
    try {
      parsedObjects = JSON.parse(body.objects);
    } catch {
      throw new HttpException("Invalid objects format", HttpStatus.BAD_REQUEST);
    }

    parsedObjects.forEach((obj, index) => {
      obj.photo = files[index]?.filename || null;
    });

    if (!body.start_date || !body.end_date) {
      throw new HttpException(
        "Missing start_date or end_date",
        HttpStatus.BAD_REQUEST
      );
    }

    const parseDate = (dateStr: string) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) return date;

      const dateWithTime = new Date(dateStr + "T00:00:00Z");
      if (!isNaN(dateWithTime.getTime())) return dateWithTime;

      return null;
    };

    const startDate = parseDate(body.start_date);
    const endDate = parseDate(body.end_date);

    if (!startDate || !endDate) {
      throw new HttpException(
        "Invalid start_date or end_date",
        HttpStatus.BAD_REQUEST
      );
    }

    console.log("price raw:", body.price);
    console.log("price parsed:", parseFloat(body.price));

    const finalDto: CreateDeliveryRequestDto = {
      start_city: body.start_city,
      arrival_city: body.arrival_city,
      price: parseFloat(body.price),
      assurance: body.assurance === "true",
      urgent: body.urgent === "true",
      start_date: startDate,
      end_date: endDate,
      objects: parsedObjects,
    };

    // const delivery = this.deliveriesRepository.create({
    //   ...finalDto,
    //   customer: { id: customerId },
    //   objects: finalDto.objects,
    // });

    //return this.deliveriesRepository.save(delivery);
  }

  async findAll() {
    return this.deliveriesRepository.find({ relations: ["customer"] });
  }
}
