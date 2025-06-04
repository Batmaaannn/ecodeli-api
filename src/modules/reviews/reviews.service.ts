import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./entities/reviews.entity";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";
import { CustomersService } from "../customers/customers.service";
import { ServiceAgentsService } from "../service-agents/service-agents.service";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly customersService: CustomersService,
    private readonly serviceAgentsService: ServiceAgentsService
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const { customerId, serviceAgentId, rating, comment, date } =
      createReviewDto;

    const customer = await this.customersService.findOne(customerId);
    if (!customer) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }

    const serviceAgent =
      await this.serviceAgentsService.findOne(serviceAgentId);
    if (!serviceAgent) {
      throw new HttpException("Service agent not found", HttpStatus.NOT_FOUND);
    }

    const review = this.reviewRepository.create({
      customer,
      serviceAgent,
      rating,
      comment,
      date,
    });

    return this.reviewRepository.save(review);
  }

  /* Db Requests */

  async findByServiceAgent(serviceAgentId: number): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { service_agent_id: serviceAgentId },
      relations: ["customer"],
      order: { date: "DESC" },
    });
  }
}
