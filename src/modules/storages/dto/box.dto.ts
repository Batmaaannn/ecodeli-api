import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { BoxSize } from "src/types/box";

export class BoxDto {
  @ApiProperty()
  @IsNotEmpty()
  warehouseId: number;

  @ApiProperty()
  @IsNotEmpty()
  size: BoxSize;

  @ApiProperty()
  @IsNotEmpty()
  rentalStart: Date;

  @ApiProperty()
  @IsNotEmpty()
  rentalEnd: Date;
}