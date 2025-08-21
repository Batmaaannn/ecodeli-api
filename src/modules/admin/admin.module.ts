import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UsersModule } from "../users/users.module";
import { DeliveryAgentsModule } from "../delivery-agents/delivery-agents.module";
import { ServiceAgentsModule } from "../service-agents/service-agents.module";

@Module({
  imports: [UsersModule, DeliveryAgentsModule, ServiceAgentsModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
