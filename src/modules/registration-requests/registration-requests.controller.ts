import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";
import { UpdateStatusRequestDto } from "./dto/update-status-registration.dto";
import { ServiceAgentsService } from "../service-agents/service-agents.service";

@ApiTags("registration-requests")
@Controller("registration-requests")
export class RegistrationRequestsController {
  constructor(
    private readonly registrationRequestsService: RegistrationRequestsService,
    private readonly usersService: UsersService,
    private serviceAgentsService: ServiceAgentsService
    // private readonly usersService: UsersService
  ) {}

  @Get()
  @Roles(UserType.ADMIN)
  async getAllRegistrationRequests() {
    return this.registrationRequestsService.findAll();
  }

  @Get(":id")
  @Roles(UserType.ADMIN)
  async getRegistrationRequestById(@Param("id", ParseIntPipe) id: number) {
    return this.registrationRequestsService.getRegistrationRequestById(id);
  }

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
    const { siret, email } = createDeliveryAgentRequestDto;

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

    return this.registrationRequestsService.createDeliveryAgentRequest(
      createDeliveryAgentRequestDto
    );
  }

  // @Patch(":id/status")
  // @Roles(UserType.ADMIN)
  // async updateRegistrationRequestStatus(
  //   @Param("id", ParseIntPipe) id: number,
  //   @Body() updateStatusRequestDto: UpdateStatusRequestDto
  // ) {
  //   console.log("updateStatusRequestDto", updateStatusRequestDto);
  //   return this.registrationRequestsService.updateRegistrationRequestStatus(
  //     id,
  //     updateStatusRequestDto
  //   );
  // }

  @Post("/validate/id")
  async validateAgent(@Param("id", ParseIntPipe) id: number) {
    const registrationRequest =
      await this.registrationRequestsService.findOneByIdWithRelations(id);

    const { siret, email } = registrationRequest;
    await isBlacklisted(email);

    const siretExists = await this.serviceAgentsService.findOneBySiret(siret);
    if (siretExists) {
      throw new HttpException("Siret exists", HttpStatus.CONFLICT);
    }

    const existingEmail = await this.usersService.findOneByEmail(email);
    if (existingEmail) {
      throw new HttpException("Existing Email", HttpStatus.CONFLICT);
    }

    return this.registrationRequestsService.validateAgent(registrationRequest);
  }
}
