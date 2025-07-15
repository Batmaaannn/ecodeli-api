import { Controller, Post, Body, Get } from "@nestjs/common";
import { TripService} from "./trip.service";

class CreateTripDto {
    start_city: string;
    end_city: string;
    date: string;
    delivery_agent_id: number;
}

@Controller("trips")
export class TripController {
    constructor(private readonly tripService: TripService) {}

    @Post()
    async createTrip(@Body() createTripDto: CreateTripDto) {
        const { start_city, end_city, date, delivery_agent_id } = createTripDto;
        const trip = await this.tripService.createTrip(start_city, end_city, new Date(date), delivery_agent_id);
        return trip;
    }

    @Get()
    async getAllTrips() {
        return this.tripService.findAllTrips();
    }
}
