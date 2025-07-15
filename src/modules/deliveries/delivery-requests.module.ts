import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryRequest } from "./entities/delivery-request.entity";
import {DeliveryRequestsService} from "./delivery-requests.service";
import {DeliveryRequestsController} from "./delivery-requests.controller";
import {Module} from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([DeliveryRequest])],
    providers: [DeliveryRequestsService],
    controllers: [DeliveryRequestsController],
})
export class DeliveryRequestsModule {}
