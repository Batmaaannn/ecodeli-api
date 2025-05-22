import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { Public } from "../auth/decorator/public.decorator";
import { UsersService } from "../users/users.service";
import { isBlacklisted } from "src/utils/email-blacklisted";
import { CreateUserCustomerDto } from "./dto/create-user-customer.dto";
import { CustomersService } from "./customers.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("customers")
@Controller("customers")
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @Post('create-customer')
  async createCustomer(@Body() createUserDto: CreateUserCustomerDto) {
    const { email } = createUserDto;

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser)
      throw new HttpException("Existing User", HttpStatus.FORBIDDEN);

    await isBlacklisted(email);

    return this.customersService.createCustomer(createUserDto);
  }
}
