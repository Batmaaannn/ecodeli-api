import { TypeOrmModule } from "@nestjs/typeorm";
import { Delivery } from "./entities/delivery.entity";
import { DeliveriesService } from "./deliveries.service";
import { DeliveriesController } from "./deliveries.controller";
import { Module } from "@nestjs/common";
import { Route } from "./entities/route.entity";
import { Package } from "./entities/package.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, Route, Package])],
  providers: [DeliveriesService],
  controllers: [DeliveriesController],
})
export class DeliveriesModule {}
