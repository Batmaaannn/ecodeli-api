import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CustomersService } from "../customers/customers.service";
import { ServiceAgentsService } from "../service-agents/service-agents.service";
import { Rating } from "./entities/rating.entity";
import { CreateRatingDto } from "./dto/create-rating.dto";

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    private readonly customersService: CustomersService,
    private readonly serviceAgentsService: ServiceAgentsService
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    const { customerId, serviceAgentId, rating, comment, date } =
      createRatingDto;

    const customer = await this.customersService.findOne(customerId);
    if (!customer) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }

    const serviceAgent =
      await this.serviceAgentsService.findOne(serviceAgentId);
    if (!serviceAgent) {
      throw new HttpException("Service agent not found", HttpStatus.NOT_FOUND);
    }

    const rated = this.ratingRepository.create({
      rating,
      comment,
      date,
    });

    return this.ratingRepository.save(rated);
  }

  /* Db Requests */

  async findByServiceAgent(serviceAgentId: number): Promise<Rating[]> {
    // return this.ratingRepository.find({
    //   where: { service_agent_id: serviceAgentId },
    //   relations: ["customer"],
    //   order: { date: "DESC" },
    // });
    return;
  }
}
