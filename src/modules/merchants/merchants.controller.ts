import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MerchantsService } from "./merchants.service";
import { UsersService } from "../users/users.service";
import { Public } from "../auth/decorator/public.decorator";
import { isBlacklisted } from "src/utils/email-blacklisted";
import { CreateUserMerchantDto } from "./dto/create-user-merchant.dto";

@ApiTags("merchants")
@Controller("merchants")
export class MerchantsController {
  constructor(
    private readonly merchantsService: MerchantsService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @Post("create-merchant")
  async createMerchant(@Body() createUserDto: CreateUserMerchantDto) {
    const { email, siret } = createUserDto;

    const siretExists = await this.merchantsService.findOneBySiret(siret);
    if (siretExists) {
      throw new HttpException("Siret exists", HttpStatus.CONFLICT);
    }

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser)
      throw new HttpException("Existing User", HttpStatus.FORBIDDEN);

    await isBlacklisted(email);

    return this.merchantsService.createMerchant(createUserDto);
  }
}
