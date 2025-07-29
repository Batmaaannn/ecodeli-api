import { Module } from "@nestjs/common";
import { Rating } from "./entities/ratings.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { CustomersModule } from "../customers/customers.module";
import { ServiceAgentsModule } from "../service-agents/service-agents.module";
import { RatingsController } from "./ratings.controller";
import { RatingsService } from "./ratings.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating]),
    UsersModule,
    CustomersModule,
    ServiceAgentsModule,
  ],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
