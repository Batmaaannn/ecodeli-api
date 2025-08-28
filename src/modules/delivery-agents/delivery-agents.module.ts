import { Module } from "@nestjs/common";
import { DeliveryAgentsController } from "./delivery-agents.controller";
import { DeliveryAgent } from "./entities/delivery-agents.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DeliveryAgentsService } from "./delivery-agents.service";
import { UsersModule } from "../users/users.module";
import { FilesModule } from "../files/files.module";
import { DeliveryAgentsSchedule } from "./entities/delivery-agents-schedule.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryAgent, DeliveryAgentsSchedule]),
    UsersModule,
    FilesModule,
  ],
  providers: [DeliveryAgentsService],
  controllers: [DeliveryAgentsController],
  exports: [DeliveryAgentsService],
})
export class DeliveryAgentsModule {}
