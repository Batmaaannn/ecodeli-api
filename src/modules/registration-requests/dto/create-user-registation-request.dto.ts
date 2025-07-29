import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsEnum,
  IsOptional,
} from "class-validator";
import { VehiculeType } from "src/types/vehicule";
import { ApiProperty } from "@nestjs/swagger";
import { Status } from "src/types/status";
import { AgentType } from "src/types/user";

export class CreateUserFromRegistrationRequestDto {
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

  @ApiProperty({ enum: AgentType, default: AgentType.DELIVERY_AGENT })
  @IsEnum(AgentType)
  agent_type: AgentType;

  // @ApiProperty()
  // @IsOptional()
  // prestationLinks?: PrestationRegistrationRequest[];

  @ApiProperty({ enum: VehiculeType, required: false })
  @IsEnum(VehiculeType)
  @IsOptional()
  vehicle_type?: VehiculeType;

  @ApiProperty({ enum: Status, default: Status.PENDING })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
