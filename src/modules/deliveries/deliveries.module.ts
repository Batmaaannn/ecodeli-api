import { TypeOrmModule } from "@nestjs/typeorm";
import { Delivery } from "./entities/delivery.entity";
import { DeliveriesService } from "./deliveries.service";
import { DeliveriesController } from "./deliveries.controller";
import { forwardRef, Module } from "@nestjs/common";
import { Route } from "./entities/route.entity";
import { Package } from "./entities/package.entity";
import { DeliveryAgentsModule } from "../delivery-agents/delivery-agents.module";
import { AnnouncementsModule } from "../announcements/announcements.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery, Route, Package, DeliveryAgentsModule]),
    forwardRef(() => AnnouncementsModule),
    DeliveryAgentsModule,
    UsersModule,
  ],
  providers: [DeliveriesService],
  controllers: [DeliveriesController],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
