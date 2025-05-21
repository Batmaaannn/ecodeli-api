import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, Length, IsEnum } from "class-validator";
import { VehiculeType } from "src/types/vehicule";

export class CreateDeliveryAgentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(14, 14, { message: "Siret is not equal 14" })
  siret: string;

  @ApiProperty()
  @IsNotEmpty()
  company_name: string;

  @ApiProperty()
  @IsNotEmpty()
  company_address: string;

  @ApiProperty()
  @IsNotEmpty()
  company_city: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 15, { message: "Driving license length must be between 1 and 15" })
  driving_license?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(VehiculeType)
  vehicle_type: VehiculeType;
}
