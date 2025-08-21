import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsEnum,
  IsOptional,
} from "class-validator";
import { VehiculeType } from "src/types/vehicule";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDeliveryAgentDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(14, 14, { message: "Siret is not equal 14" })
  companySiret: string;

  @ApiProperty()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  companyAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  companyCity: string;

  @ApiProperty()
  @IsNotEmpty()
  companyPostalCode: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  vehiculeType: VehiculeType;

  @ApiProperty()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty()
  files: Express.Multer.File[];
}
