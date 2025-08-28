import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MerchantDelivery, MerchantDeliveryStatus } from "./entities/merchant-delivery.entity";
import { CreateMerchantDeliveryDto } from "./dto/create-merchant-delivery.dto";
import { UpdateMerchantDeliveryDto } from "./dto/update-merchant-delivery.dto";
import { Merchant } from "./entities/merchants.entity";

@Injectable()
export class MerchantDeliveriesService {
  constructor(
    @InjectRepository(MerchantDelivery)
    private readonly merchantDeliveryRepository: Repository<MerchantDelivery>,
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ) {}

  async create(
    merchantId: number,
    createMerchantDeliveryDto: CreateMerchantDeliveryDto
  ): Promise<MerchantDelivery> {
    const merchant = await this.merchantRepository.findOne({
      where: { id: merchantId }
    });

    if (!merchant) {
      throw new NotFoundException("Merchant not found");
    }

    const merchantDelivery = this.merchantDeliveryRepository.create({
      ...createMerchantDeliveryDto,
      merchant_id: merchantId,
      pickup_address: merchant.company_address,
      status: MerchantDeliveryStatus.PENDING,
    });

    return this.merchantDeliveryRepository.save(merchantDelivery);
  }

  async findAll(merchantId: number): Promise<MerchantDelivery[]> {
    return this.merchantDeliveryRepository.find({
      where: { merchant_id: merchantId },
      relations: ["delivery", "customer"],
      order: { created_at: "DESC" },
    });
  }

  async findOne(id: number, merchantId: number): Promise<MerchantDelivery> {
    const delivery = await this.merchantDeliveryRepository.findOne({
      where: { id, merchant_id: merchantId },
      relations: ["delivery", "customer", "merchant"],
    });

    if (!delivery) {
      throw new NotFoundException("Merchant delivery not found");
    }

    return delivery;
  }

  async update(
    id: number,
    merchantId: number,
    updateMerchantDeliveryDto: UpdateMerchantDeliveryDto
  ): Promise<MerchantDelivery> {
    const delivery = await this.findOne(id, merchantId);

    if (delivery.status === MerchantDeliveryStatus.DELIVERED) {
      throw new BadRequestException("Cannot update a delivered order");
    }

    Object.assign(delivery, updateMerchantDeliveryDto);
    return this.merchantDeliveryRepository.save(delivery);
  }

  async cancel(id: number, merchantId: number): Promise<MerchantDelivery> {
    const delivery = await this.findOne(id, merchantId);

    if (delivery.status === MerchantDeliveryStatus.DELIVERED) {
      throw new BadRequestException("Cannot cancel a delivered order");
    }

    delivery.status = MerchantDeliveryStatus.CANCELLED;
    return this.merchantDeliveryRepository.save(delivery);
  }

  async getStatistics(merchantId: number) {
    const totalDeliveries = await this.merchantDeliveryRepository.count({
      where: { merchant_id: merchantId },
    });

    const deliveredCount = await this.merchantDeliveryRepository.count({
      where: {
        merchant_id: merchantId,
        status: MerchantDeliveryStatus.DELIVERED,
      },
    });

    const pendingCount = await this.merchantDeliveryRepository.count({
      where: {
        merchant_id: merchantId,
        status: MerchantDeliveryStatus.PENDING,
      },
    });

    const inTransitCount = await this.merchantDeliveryRepository.count({
      where: {
        merchant_id: merchantId,
        status: MerchantDeliveryStatus.IN_TRANSIT,
      },
    });

    return {
      total: totalDeliveries,
      delivered: deliveredCount,
      pending: pendingCount,
      inTransit: inTransitCount,
      deliveryRate: totalDeliveries > 0 ? (deliveredCount / totalDeliveries) * 100 : 0,
    };
  }

  async assignToDeliveryAgent(
    merchantDeliveryId: number,
    deliveryId: number
  ): Promise<MerchantDelivery> {
    const merchantDelivery = await this.merchantDeliveryRepository.findOne({
      where: { id: merchantDeliveryId },
    });

    if (!merchantDelivery) {
      throw new NotFoundException("Merchant delivery not found");
    }

    merchantDelivery.delivery_id = deliveryId;
    merchantDelivery.status = MerchantDeliveryStatus.ASSIGNED;

    return this.merchantDeliveryRepository.save(merchantDelivery);
  }
}