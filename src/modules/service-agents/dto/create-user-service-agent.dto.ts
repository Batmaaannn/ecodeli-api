import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsEnum,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateServiceAgentDto {
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

  @ApiProperty({ type: [Number] })
  @IsNotEmpty()
  prestationLinks?: number[];
}
