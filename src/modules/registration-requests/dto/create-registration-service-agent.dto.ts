import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsEmail,
  Length,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Prestation } from "src/modules/prestations/entities/prestations.entity";

export class CreateServiceAgentRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(14, 14, { message: "Siret is not equal 14" })
  siret: string;

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
  phoneNumber: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrestationsRequestDto)
  prestations: PrestationsRequestDto[];
}

export class PrestationsRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  prestationId: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;
}
