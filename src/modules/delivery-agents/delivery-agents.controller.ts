import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import { DeliveryAgentsService } from "./delivery-agents.service";
import { Public } from "../auth/decorator/public.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";
import { isBlacklisted } from "src/utils/emails/email-blacklisted";
import { CreateUserDeliveryAgentDto } from "./dto/create-user-delivery-agent.dto";

@ApiTags("delivery-agents")
@Controller("delivery-agents")
export class DeliveryAgentsController {
  constructor(
    private readonly deliveryAgentsService: DeliveryAgentsService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @UseInterceptors(FilesInterceptor("files"))
  @Post("create-deliver")
  async createDeliveryAgent(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createUserDto: CreateUserDeliveryAgentDto
  ) {
    const { email, companySiret, licenseNumber } = createUserDto;

    const siretExists =
      await this.deliveryAgentsService.findOneBySiret(companySiret);
    if (siretExists) {
      throw new HttpException("Siret exists", HttpStatus.CONFLICT);
    }

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser)
      throw new HttpException("Existing User", HttpStatus.FORBIDDEN);

    const existingDeliveryAgent =
      await this.deliveryAgentsService.findOneByLicense(licenseNumber);
    if (existingDeliveryAgent)
      throw new HttpException("Existing Delivery Agent", HttpStatus.FORBIDDEN);

    await isBlacklisted(email);

    return this.deliveryAgentsService.createDeliveryAgent({
      ...createUserDto,
      files,
    });
  }
}
