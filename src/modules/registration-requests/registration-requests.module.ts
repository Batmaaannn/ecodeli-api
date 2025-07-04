import { Module } from "@nestjs/common";
import { RegistrationRequestsController } from "./registration-requests.controller";
import { RegistrationRequestsService } from "./registration-requests.service";
import { RegistrationRequest } from "./entities/registration-requests.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { PrestationRegistrationRequest } from "./entities/prestation-registration-request.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegistrationRequest,
      PrestationRegistrationRequest,
    ]),
    UsersModule,
  ],
  controllers: [RegistrationRequestsController],
  providers: [RegistrationRequestsService],
})
export class RegistrationRequestsModule {}
