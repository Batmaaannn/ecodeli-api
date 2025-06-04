import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateReviewDto {
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
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  date: Date;
}
