import { Controller, Post } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/decorator/public.decorator";

@ApiTags("service-agents")
@Controller("service-agents")
export class ServiceAgentsController {
  constructor(private readonly usersService: UsersService) {}
}
