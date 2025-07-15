import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DeliveryRequest } from "./entities/delivery-request.entity";
import { CreateDeliveryRequestDto } from "./dto/create-delivery-request.dto";

@Injectable()
export class DeliveryRequestsService {
    constructor(
        @InjectRepository(DeliveryRequest)
        private readonly deliveryRepo: Repository<DeliveryRequest>
    ) {}

    async create(dto: CreateDeliveryRequestDto, customerId: number) {
        const delivery = this.deliveryRepo.create({
            ...dto,
            customer: { id: customerId },
            objects: dto.objects,
        });

        return this.deliveryRepo.save(delivery);
    }

    async findAll() {
        return this.deliveryRepo.find({ relations: ["customer"] });
    }
}
