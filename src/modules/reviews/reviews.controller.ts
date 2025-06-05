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
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewsService } from "./reviews.service";
import { Roles } from "../auth/decorator/roles.decorator";
import { UserType } from "src/types/user";

@ApiBearerAuth()
@ApiTags("reviews")
@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService
  ) {}

  @Get("/service-agent/:id")
  async getReviewsByServiceAgent(@Param("id") serviceAgentId: number) {
    return this.reviewsService.findByServiceAgent(serviceAgentId);
  }

  @Roles(UserType.CUSTOMER)
  @Post()
  async createReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    const { userId } = req.user;
    const { appointmentId } = createReviewDto;

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

    return this.reviewsService.create(createReviewDto);
  }
}
