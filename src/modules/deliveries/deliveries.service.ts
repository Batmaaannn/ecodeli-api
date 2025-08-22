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


  async findAll() {
    return this.deliveriesRepository.find({ relations: ["customer"] });
  }
}
