import { PartialType } from "@nestjs/mapped-types";
import { CreateMerchantDeliveryDto } from "./create-merchant-delivery.dto";
import { IsEnum, IsOptional } from "class-validator";
import { MerchantDeliveryStatus } from "../entities/merchant-delivery.entity";

export class UpdateMerchantDeliveryDto extends PartialType(CreateMerchantDeliveryDto) {
  @IsEnum(MerchantDeliveryStatus)
  @IsOptional()
  status?: MerchantDeliveryStatus;
}