import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateRouteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  departureCity: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  arrivalCity: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  departureDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  arrivalDate: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxPackages: number;
}
