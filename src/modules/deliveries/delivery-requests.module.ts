import { TypeOrmModule } from "@nestjs/typeorm";
import { Delivery} from "./entities/delivery.entity";
import { DeliveryRequestsService } from "./delivery-requests.service";
import { DeliveryRequestsController } from "./delivery-requests.controller";
import { Module } from "@nestjs/common";
import { Trip } from "../trip/entities/trip.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, Trip])],
  providers: [DeliveryRequestsService],
  controllers: [DeliveryRequestsController],
})
export class DeliveryRequestsModule {}
