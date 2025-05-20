import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Public } from "./decorator/public.decorator";
import { UsersService } from "../users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req, @Body() loginUserDto: LoginUserDto) {
    const { id } = req.user;

    const user = await this.usersService.getMyUser(id);

    if (!user.email_verified_at)
      throw new HttpException("Unauthorized", HttpStatus.FORBIDDEN);

    return this.authService.login(user);
  }
}
