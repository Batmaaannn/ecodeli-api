import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { DeliveryType } from "src/types/delivery";

export class UpdateDeliveryDto {
  @ApiProperty()
  @IsNumber()
  deliveryId: number;

  @ApiProperty()
  @IsEnum(DeliveryType)
  type: DeliveryType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  intermediateCity?: string;
}
