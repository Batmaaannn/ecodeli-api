import { ApiProperty } from "@nestjs/swagger";
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Max,
} from "class-validator";
export class CreateRatingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  serviceAgentId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @ApiProperty()
  @IsNotEmpty()
  appointmentId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date: Date;
}
