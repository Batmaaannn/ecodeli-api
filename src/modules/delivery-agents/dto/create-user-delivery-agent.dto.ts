import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsEnum,
  IsOptional,
} from "class-validator";
import { VehiculeType } from "src/types/vehicule";
import { ApiProperty } from "@nestjs/swagger";
import { Statut } from "src/types/statut";
import { AgentType } from "src/types/user";

export class CreateDeliveryAgentDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(14, 14, { message: "Siret is not equal 14" })
  siret: string;

  @ApiProperty()
  @IsNotEmpty()
  token_request: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

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
  vehicle_type: VehiculeType;
}
