import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { Review } from "./entities/reviews.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { CustomersModule } from "../customers/customers.module";
import { ServiceAgentsModule } from "../service-agents/service-agents.module";

@Module({
  imports: [TypeOrmModule.forFeature([Review]), UsersModule, CustomersModule, ServiceAgentsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
