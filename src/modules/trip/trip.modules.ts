import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Trip } from "./entities/trip.entity";
import { DeliveryAgent} from "../delivery-agents/entities/delivery-agents.entity";
import { TripService} from "./trip.service";
import { TripController } from "./trip.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Trip, DeliveryAgent])],
    providers: [TripService],
    controllers: [TripController],
})
export class TripModule {}
