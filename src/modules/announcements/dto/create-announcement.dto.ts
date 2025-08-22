import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from "class-validator";
import { FileSystemStoredFile, HasMimeType, IsFile } from "nestjs-form-data";

export class CreateAnnouncementDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  departureCity: string;

  @ApiProperty()
  @IsNotEmpty()
  arrivalCity: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  pickupDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  deliveryDate: Date;

  @ApiProperty({ required: false })
  @IsBoolean()
  @Type(() => Boolean)
  assurance?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @Type(() => Boolean)
  urgent?: boolean;

  @ApiProperty({ required: false })
  pickupInstructions?: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ObjectDto)
  objects: ObjectDto[];
}

export class ObjectDto {
  @ApiProperty()
  @IsNotEmpty()
  label: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  length: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  width: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  height: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  value: number;

  @IsFile()
  @HasMimeType(["image/jpeg", "image/png"], { each: true })
  photo: FileSystemStoredFile;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  fragile: boolean;
}
