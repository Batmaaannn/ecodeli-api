import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { Public } from "../auth/decorator/public.decorator";
import { CreateServiceAgentRequestDto } from "./dto/create-registration-service-agent.dto";
import { isBlacklisted } from "src/utils/email-blacklisted";
import { UsersService } from "../users/users.service";
import { RegistrationRequestsService } from "./registration-requests.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateDeliveryAgentRequestDto } from "./dto/create-registration-delivery-agent.dto";

@ApiTags("registration-requests")
@Controller("registration-requests")
export class RegistrationRequestsController {
  constructor(
    private readonly registrationRequestsService: RegistrationRequestsService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @Post("service-agent")
  async createServiceAgent(
    @Body() createServiceAgentRequestDto: CreateServiceAgentRequestDto
  ) {
    const { siret, email } = createServiceAgentRequestDto;

    await isBlacklisted(email);

    const siretExists =
      await this.registrationRequestsService.findOneBySiret(siret);
    if (siretExists) {
      throw new HttpException("Siret exists", HttpStatus.CONFLICT);
    }

    const userRegistered = await this.usersService.findOneByEmail(email);
    if (userRegistered) {
      throw new HttpException("Email exists", HttpStatus.CONFLICT);
    }

    const emailExists =
      await this.registrationRequestsService.findOneByEmail(email);
    if (emailExists) {
      throw new HttpException("Email exists", HttpStatus.CONFLICT);
    }

    return this.registrationRequestsService.createServiceAgentRequest(
      createServiceAgentRequestDto
    );
  }

  @Public()
  @Post("delivery-agent")
  async createDeliveryAgent(
    @Body() createDeliveryAgentRequestDto: CreateDeliveryAgentRequestDto
  ) {
    const { siret, email, driving_license } = createDeliveryAgentRequestDto;

    await isBlacklisted(email);

    const siretExists =
      await this.registrationRequestsService.findOneBySiret(siret);
    if (siretExists) {
      throw new HttpException("Siret exists", HttpStatus.CONFLICT);
    }

    const userRegistered = await this.usersService.findOneByEmail(email);
    if (userRegistered) {
      throw new HttpException("Email exists", HttpStatus.CONFLICT);
    }

    const emailExists =
      await this.registrationRequestsService.findOneByEmail(email);
    if (emailExists) {
      throw new HttpException("Email exists", HttpStatus.CONFLICT);
    }

    const drivingLicenceExists =
      await this.registrationRequestsService.findOneByDrivingLicence(
        driving_license
      );
    if (drivingLicenceExists) {
      throw new HttpException("Driving licence exists", HttpStatus.CONFLICT);
    }

    return this.registrationRequestsService.createDeliveryAgentRequest(
      createDeliveryAgentRequestDto
    );
  }
}
