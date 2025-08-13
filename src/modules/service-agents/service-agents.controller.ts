import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import { Public } from "../auth/decorator/public.decorator";
import { isBlacklisted } from "src/utils/emails/email-blacklisted";
import { FormDataRequest } from "nestjs-form-data";
import { ServiceAgentsService } from "./service-agents.service";
import { CreateUserServiceAgentDto } from "./dto/create-user-service-agent.dto";

@ApiTags("service-agents")
@Controller("service-agents")
export class ServiceAgentsController {
  constructor(
    private readonly serviceAgentsService: ServiceAgentsService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @FormDataRequest()
  @Post("create-service")
  async createDeliveryAgent(@Body() createUserDto: CreateUserServiceAgentDto) {

    const { email, companySiret } = createUserDto;

    const siretExists =
      await this.serviceAgentsService.findOneBySiret(companySiret);
    if (siretExists) {
      throw new HttpException("Siret exists", HttpStatus.CONFLICT);
    }

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser)
      throw new HttpException("Existing User", HttpStatus.FORBIDDEN);

    await isBlacklisted(email);

    return this.serviceAgentsService.createServiceAgent(createUserDto);
  }
}
