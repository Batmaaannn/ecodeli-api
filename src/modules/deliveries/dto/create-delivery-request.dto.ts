import { ApiProperty } from "@nestjs/swagger";
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class CreateDelivryObjectDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    photo?: string;

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsString()
    label: string;

    @ApiProperty()
    @IsNumber()
    poids: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    additional_info?: string;
}

export class CreateDeliveryRequestDto {
    @ApiProperty()
    @IsString()
    start_city: string;

    @ApiProperty()
    @IsString()
    arrival_city: string;

    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsDateString()
    start_date: Date;

    @ApiProperty()
    @IsDateString()
    end_date: Date;

    @ApiProperty()
    @IsBoolean()
    assurance: boolean;

    @ApiProperty()
    @IsBoolean()
    urgent: boolean;

    @ApiProperty({ type: [CreateDelivryObjectDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateDelivryObjectDto)
    objects: CreateDelivryObjectDto[];
}
