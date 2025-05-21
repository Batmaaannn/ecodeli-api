import { Module } from "@nestjs/common";
import { MerchantsController } from "./merchants.controller";
import { MerchantsService } from "./merchants.service";
import { Merchant } from "./entities/merchants.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Merchant])],
  controllers: [MerchantsController],
  providers: [MerchantsService],
})
export class MerchantsModule {}
