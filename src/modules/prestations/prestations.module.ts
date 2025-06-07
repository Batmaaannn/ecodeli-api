import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Prestation } from "./entities/prestations.entity";
import { PrestationsController } from './prestations.controller';
import { PrestationsService } from './prestations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prestation])],
  controllers: [PrestationsController],
  providers: [PrestationsService],
})
export class PrestationsModule {}
