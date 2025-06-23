import { Controller, Get, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get("me")
  async getUser(@Request() req: any) {
    const { userId } = req.user;

    return this.usersService.getUser(userId);
  }
}
