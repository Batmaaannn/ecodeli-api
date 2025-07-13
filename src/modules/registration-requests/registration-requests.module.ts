import { Module } from "@nestjs/common";
import { RegistrationRequestsController } from "./registration-requests.controller";
import { RegistrationRequestsService } from "./registration-requests.service";
import { RegistrationRequest } from "./entities/registration-requests.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { PrestationRegistrationRequest } from "./entities/prestation-registration-request.entity";
import { FilesModule } from "../files/files.module";
import { ServiceAgentsModule } from "../service-agents/service-agents.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegistrationRequest,
      PrestationRegistrationRequest,
    ]),
    UsersModule,
    FilesModule,
    ServiceAgentsModule,
  ],
  controllers: [RegistrationRequestsController],
  providers: [RegistrationRequestsService],
  exports: [RegistrationRequestsService],
})
export class RegistrationRequestsModule {}
