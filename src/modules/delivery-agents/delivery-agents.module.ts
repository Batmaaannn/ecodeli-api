import { Module } from "@nestjs/common";
import { DeliveryAgentsController } from "./delivery-agents.controller";
import { DeliveryAgent } from "./entities/delivery-agents.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryAgentsService } from "./delivery-agents.service";

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryAgent])],
  providers: [DeliveryAgentsService],
  controllers: [DeliveryAgentsController],
})
export class DeliveryAgentsModule {}
