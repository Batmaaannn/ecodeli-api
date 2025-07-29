import { Module } from "@nestjs/common";
import { MerchantsController } from "./merchants.controller";
import { MerchantsService } from "./merchants.service";
import { Merchant } from "./entities/merchants.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { FilesModule } from "../files/files.module";

@Module({
  imports: [TypeOrmModule.forFeature([Merchant]), UsersModule, FilesModule],
  controllers: [MerchantsController],
  providers: [MerchantsService],
})
export class MerchantsModule {}
