import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User, UserType } from "src/types/user";
import bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user)
      throw new HttpException("Wrong Credentials", HttpStatus.UNAUTHORIZED);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new HttpException("Wrong Credentials", HttpStatus.UNAUTHORIZED);

    return user;
  }

  generateAccessToken({
    userId,
    userEmail,
    userType,
  }: {
    userId: number;
    userEmail: string;
    userType: UserType;
  }) {
    const payload = {
      sub: userId,
      email: userEmail,
      userType: userType,
    };

    return this.jwtService.sign(payload);
  }

  login(user: User) {
    const accessToken = this.generateAccessToken({
      userId: user.id,
      userEmail: user.email,
      userType: user.user_type,
    });
  }
}
