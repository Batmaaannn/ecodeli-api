import { Controller, Get, Request, Param, ParseIntPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getUser(@Request() req: any) {
    const { userId } = req.user;

    return this.usersService.getUser(userId);
  }
}
