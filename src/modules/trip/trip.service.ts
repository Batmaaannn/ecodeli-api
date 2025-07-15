import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Trip } from "./entities/trip.entity";
import { DeliveryAgent} from "../delivery-agents/entities/delivery-agents.entity";

@Injectable()
export class TripService {
    constructor(
        @InjectRepository(Trip) private tripRepository: Repository<Trip>,
        @InjectRepository(DeliveryAgent) private deliveryAgentRepository: Repository<DeliveryAgent>,
    ) {}

    async createTrip(
        start_city: string,
        end_city: string,
        date: Date,
        delivery_agent_id: number,
    ): Promise<Trip> {
        const agent = await this.deliveryAgentRepository.findOne({ where: { id: delivery_agent_id } });
        if (!agent) {
            throw new Error("Delivery agent not found");
        }
        const trip = this.tripRepository.create({ start_city, end_city, date, delivery_agent: agent });
        return this.tripRepository.save(trip);
    }

    async findAllTrips(): Promise<Trip[]> {
        return this.tripRepository.find();
    }
}
