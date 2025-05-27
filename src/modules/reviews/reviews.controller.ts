import { Controller } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";

@ApiBearerAuth()
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly usersService: UsersService) {}
}
