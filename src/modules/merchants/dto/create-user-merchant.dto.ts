import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, Length } from "class-validator";

export class CreateUserMerchantDto {
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
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  phone_number: string;
}
