import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateAnnouncementDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    departure_city: string;

    @ApiProperty()
    @IsNotEmpty()
    arrival_city: string;

    @ApiProperty()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsNotEmpty()
    pickup_date: Date;

    @ApiProperty()
    @IsNotEmpty()
    delivery_date: Date;

    @ApiProperty({ required: false })
    assurance?: boolean;

    @ApiProperty({ required: false })
    urgent?: boolean;

    @ApiProperty({ required: false })
    pickup_instructions?: string;

    @ApiProperty()
    @IsNotEmpty()
    customer_id: number;
}
