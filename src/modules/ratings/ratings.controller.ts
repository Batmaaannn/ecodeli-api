import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";

import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";
import { RatingsService } from "./ratings.service";
import { CreateRatingDto } from "./dto/create-rating.dto";

@ApiBearerAuth()
@ApiTags("ratings")
@Controller("ratings")
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
    private readonly usersService: UsersService
  ) {}

  @Get("/service-agent/:id")
  async getRatingsByServiceAgent(@Param("id") serviceAgentId: number) {
    return this.ratingsService.findByServiceAgent(serviceAgentId);
  }

  @Roles(UserType.CUSTOMER)
  @Post()
  async createRating(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    const { userId } = req.user;
    const { appointmentId } = createRatingDto;

    const user = await this.usersService.getUser(userId);

    // const appointment =
    //   await this.appointmentsService.getAppointmentById(appointmentId);
    // if (!appointment)
    //   throw new HttpException(
    //     "Appointment not found",
    //     HttpStatus.NOT_FOUND
    //   );

    //const isAuthorized = checkUserCanAddReview(user, appointment);

    // if (!isAuthorized)
    //   throw new HttpException(
    //     "Unauthorized - you can't create this resource",
    //     HttpStatus.UNAUTHORIZED
    //   );

    return this.ratingsService.create(createRatingDto);
  }
}
