import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prestation } from "./entities/prestations.entity";
import { PrestationsController } from "./prestations.controller";
import { PrestationsService } from "./prestations.service";
import { ServiceAgentPrestation } from "./entities/service-agent-prestation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Prestation, ServiceAgentPrestation])],
  controllers: [PrestationsController],
  providers: [PrestationsService],
  exports: [PrestationsService],
})
export class PrestationsModule {}
