import { Module } from "@nestjs/common";
import { ServiceAgentsController } from "./service-agents.controller";
import { ServiceAgentsService } from "./service-agents.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceAgent } from "./entities/service-agents.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ServiceAgent])],
  controllers: [ServiceAgentsController],
  providers: [ServiceAgentsService],
})
export class ServiceAgentsModule {}
