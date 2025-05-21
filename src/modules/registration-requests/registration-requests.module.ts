import { Module } from "@nestjs/common";
import { RegistrationRequestsController } from "./registration-requests.controller";
import { RegistrationRequestsService } from "./registration-requests.service";

@Module({
  controllers: [RegistrationRequestsController],
  providers: [RegistrationRequestsService],
})
export class RegistrationRequestsModule {}
