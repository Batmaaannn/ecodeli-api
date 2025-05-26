import { Module } from "@nestjs/common";
import { MerchantsController } from "./merchants.controller";
import { MerchantsService } from "./merchants.service";
import { Merchant } from "./entities/merchants.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Merchant]), UsersModule],
  controllers: [MerchantsController],
  providers: [MerchantsService],
})
export class MerchantsModule {}
