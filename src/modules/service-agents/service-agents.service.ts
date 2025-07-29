import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ServiceAgent } from "./entities/service-agents.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { UserType } from "src/types/user";
import { CreateServiceAgentDto } from "./dto/create-user-service-agent.dto";

@Injectable()
export class ServiceAgentsService {
  constructor(
    @InjectRepository(ServiceAgent)
    private readonly serviceAgentsRepository: Repository<ServiceAgent>,
    private readonly usersService: UsersService
  ) {}

  async createServiceAgent(createUserDto: CreateServiceAgentDto) {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      siret,
      company_address,
      company_name,
      company_city,
      token_request,
    } = createUserDto;

    const createdServiceAgent = await this.insertOne({
      first_name,
      last_name,
      phone_number,
      siret,
      company_address,
      company_name,
      company_city,
    });

    const insertedUser = await this.usersService.insertOneServiceAgent(
      {
        email,
        password: "",
        user_type: UserType.SERVICE_AGENT,
      },
      createdServiceAgent
    );

    await this.updateOneById(insertedUser.service_agent.id, {
      user_id: insertedUser.id,
    });

    //TODO: send email to service agent with token_request for reset password
  }

  /* Db requests */
  async findOne(id: number): Promise<ServiceAgent> {
    return this.serviceAgentsRepository.findOne({ where: { id } });
  }

  findOneBySiret(siret: string): Promise<ServiceAgent> {
    return this.serviceAgentsRepository.findOne({
      where: { siret },
    });
  }

  async insertOne(
    merchantToCreate: Pick<
      ServiceAgent,
      | "first_name"
      | "last_name"
      | "phone_number"
      | "siret"
      | "company_address"
      | "company_name"
      | "company_city"
    >
  ) {
    const serviceAgent = this.serviceAgentsRepository.create(merchantToCreate);
    return this.serviceAgentsRepository.save(serviceAgent);
  }

  async updateOneById(
    id: number,
    dataToUpdate: Partial<ServiceAgent>
  ): Promise<ServiceAgent> {
    await this.serviceAgentsRepository.update(id, dataToUpdate);

    return this.serviceAgentsRepository.findOne({ where: { id } });
  }
}
