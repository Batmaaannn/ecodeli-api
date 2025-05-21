import { Module } from "@nestjs/common";
import { RegistrationRequestsController } from "./registration-requests.controller";
import { RegistrationRequestsService } from "./registration-requests.service";
import { RegistrationRequest } from "./entities/registration-requests.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([RegistrationRequest])],
  controllers: [RegistrationRequestsController],
  providers: [RegistrationRequestsService],
})
export class RegistrationRequestsModule {}
