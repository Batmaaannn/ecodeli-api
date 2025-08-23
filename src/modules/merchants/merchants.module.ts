import { Module } from "@nestjs/common";
import { MerchantsController } from "./merchants.controller";
import { MerchantsService } from "./merchants.service";
import { MerchantDeliveriesController } from "./merchant-deliveries.controller";
import { MerchantDeliveriesService } from "./merchant-deliveries.service";
import { Merchant } from "./entities/merchants.entity";
import { MerchantDelivery } from "./entities/merchant-delivery.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { FilesModule } from "../files/files.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Merchant, MerchantDelivery]),
    UsersModule,
    FilesModule,
  ],
  controllers: [MerchantsController, MerchantDeliveriesController],
  providers: [MerchantsService, MerchantDeliveriesService],
  exports: [MerchantsService, MerchantDeliveriesService],
})
export class MerchantsModule {}
