import { Controller, Get, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";

@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getUser(@Request() req: any) {
    const { userId } = req.user;

    return this.usersService.getUser(userId);
  }

  @Roles(UserType.ADMIN)
  @Get("requests")
  async getUsersRequestsNotValidated() {
    return this.usersService.findUsersRequestsNotValidated();
  }
}
