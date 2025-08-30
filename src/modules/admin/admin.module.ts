import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UsersModule } from "../users/users.module";
import { DeliveryAgentsModule } from "../delivery-agents/delivery-agents.module";
import { ServiceAgentsModule } from "../service-agents/service-agents.module";
import { ServiceAgent } from "../service-agents/entities/service-agents.entity";
import { ServiceAgentPrestation } from "../prestations/entities/service-agent-prestation.entity";
import { Prestation } from "../prestations/entities/prestations.entity";
import { DeliveryAgent } from "../delivery-agents/entities/delivery-agents.entity";

@Module({
  imports: [
    UsersModule, 
    DeliveryAgentsModule, 
    ServiceAgentsModule,
    TypeOrmModule.forFeature([
      ServiceAgent,
      ServiceAgentPrestation,
      Prestation,
      DeliveryAgent,
    ])
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}