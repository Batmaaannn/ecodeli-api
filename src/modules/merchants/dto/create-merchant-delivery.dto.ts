import { IsString, IsNumber, IsOptional, IsEmail, IsDateString } from "class-validator";

export class CreateMerchantDeliveryDto {
  @IsString()
  order_reference: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  order_amount: number;

  @IsString()
  delivery_address: string;

  @IsString()
  customer_name: string;

  @IsString()
  customer_phone: string;

  @IsEmail()
  @IsOptional()
  customer_email?: string;

  @IsNumber()
  delivery_fee: number;

  @IsDateString()
  @IsOptional()
  preferred_delivery_date?: string;

  @IsString()
  @IsOptional()
  preferred_delivery_time_slot?: string;
}