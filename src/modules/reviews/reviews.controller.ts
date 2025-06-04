import { Body, Controller, Get, Param, Post } from "@nestjs/common";
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
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get("/service-agent/:id")
  async getReviewsByServiceAgent(@Param("id") serviceAgentId: number) {
    return this.reviewsService.findByServiceAgent(serviceAgentId);
  }

  @Roles(UserType.CUSTOMER)
  @Post()
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }
}
