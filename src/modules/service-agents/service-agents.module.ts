import { Module } from "@nestjs/common";
import { ServiceAgentsController } from "./service-agents.controller";
import { ServiceAgentsService } from "./service-agents.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServiceAgent } from "./entities/service-agents.entity";
import { UsersModule } from "../users/users.module";
import { FileSystemStoredFile, NestjsFormDataModule } from "nestjs-form-data";
import { FilesModule } from "../files/files.module";
import { PrestationsModule } from "../prestations/prestations.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceAgent]),
    NestjsFormDataModule.config({ storage: FileSystemStoredFile }),
    UsersModule,
    FilesModule,
    PrestationsModule,
  ],
  controllers: [ServiceAgentsController],
  providers: [ServiceAgentsService],
  exports: [ServiceAgentsService],
})
export class ServiceAgentsModule {}
