import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { Public } from "../auth/decorator/public.decorator";
import { CreateServiceAgentRequestDto } from "./dto/create-registration-service-agent.dto";
import { isBlacklisted } from "src/utils/emails/email-blacklisted";
import { UsersService } from "../users/users.service";
import { RegistrationRequestsService } from "./registration-requests.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateDeliveryAgentRequestDto } from "./dto/create-registration-delivery-agent.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@ApiTags("registration-requests")
@Controller("registration-requests")
export class RegistrationRequestsController {
  constructor(
    private readonly registrationRequestsService: RegistrationRequestsService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @UseInterceptors(FilesInterceptor("files"))
  @Post("service-agent")
  async createServiceAgent(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createServiceAgentRequestDto: Record<string, any>
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
      throw new HttpException("User exists", HttpStatus.CONFLICT);
    }

    const emailExists =
      await this.registrationRequestsService.findOneByEmail(email);
    if (emailExists) {
      throw new HttpException("Email exists", HttpStatus.CONFLICT);
    }

    if (files?.length > 0) {
      files.map((file) => {
        if (
          !file.mimetype.match(
            /jpg|jpeg|png|application\/octet-stream|application\/pdf/i
          )
        )
          throw new HttpException(
            "Can only process jpg, jpeg or pdf files",
            HttpStatus.BAD_REQUEST
          );
      });
    }

    if (typeof createServiceAgentRequestDto.prestations === "string") {
      try {
        createServiceAgentRequestDto.prestations = JSON.parse(
          createServiceAgentRequestDto.prestations
        );
      } catch (e) {
        throw new HttpException(
          "formated prestations field is not valid JSON",
          HttpStatus.BAD_REQUEST
        );
      }
    }

    const dto = plainToInstance(
      CreateServiceAgentRequestDto,
      createServiceAgentRequestDto
    );
    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    return this.registrationRequestsService.createServiceAgentRequest({
      ...createServiceAgentRequestDto,
      files,
    });
  }

  @Public()
  @Post("delivery-agent")
  async createDeliveryAgent(
    @Body() createDeliveryAgentRequestDto: CreateDeliveryAgentRequestDto
  ) {
    const { siret, email, drivingLicense } = createDeliveryAgentRequestDto;

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
        drivingLicense
      );
    if (drivingLicenceExists) {
      throw new HttpException("Driving licence exists", HttpStatus.CONFLICT);
    }

    return this.registrationRequestsService.createDeliveryAgentRequest(
      createDeliveryAgentRequestDto
    );
  }
}
