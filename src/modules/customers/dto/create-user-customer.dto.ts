import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserCustomerDto {
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
  city?: string;
}
