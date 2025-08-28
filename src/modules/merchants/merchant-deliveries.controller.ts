import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { MerchantDeliveriesService } from "./merchant-deliveries.service";
import { CreateMerchantDeliveryDto } from "./dto/create-merchant-delivery.dto";
import { UpdateMerchantDeliveryDto } from "./dto/update-merchant-delivery.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("merchant-deliveries")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("merchants/:merchantId/deliveries")
export class MerchantDeliveriesController {
  constructor(
    private readonly merchantDeliveriesService: MerchantDeliveriesService
  ) {}

  @Post()
  async create(
    @Param("merchantId") merchantId: string,
    @Body() createMerchantDeliveryDto: CreateMerchantDeliveryDto,
    @Request() req
  ) {
    return this.merchantDeliveriesService.create(
      +merchantId,
      createMerchantDeliveryDto
    );
  }

  @Get()
  async findAll(
    @Param("merchantId") merchantId: string,
    @Request() req
  ) {
    return this.merchantDeliveriesService.findAll(+merchantId);
  }

  @Get("statistics")
  async getStatistics(
    @Param("merchantId") merchantId: string,
    @Request() req
  ) {
    return this.merchantDeliveriesService.getStatistics(+merchantId);
  }

  @Get(":id")
  async findOne(
    @Param("merchantId") merchantId: string,
    @Param("id") id: string,
    @Request() req
  ) {
    return this.merchantDeliveriesService.findOne(+id, +merchantId);
  }

  @Put(":id")
  async update(
    @Param("merchantId") merchantId: string,
    @Param("id") id: string,
    @Body() updateMerchantDeliveryDto: UpdateMerchantDeliveryDto,
    @Request() req
  ) {
    return this.merchantDeliveriesService.update(
      +id,
      +merchantId,
      updateMerchantDeliveryDto
    );
  }

  @Delete(":id")
  async cancel(
    @Param("merchantId") merchantId: string,
    @Param("id") id: string,
    @Request() req
  ) {
    return this.merchantDeliveriesService.cancel(+id, +merchantId);
  }
}