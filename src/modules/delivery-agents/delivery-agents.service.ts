import { Injectable } from "@nestjs/common";
import { DeliveryAgent } from "./entities/delivery-agents.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { UserType } from "src/types/user";
import { CreateDeliveryAgentDto } from "./dto/create-user-delivery-agent.dto";

@Injectable()
export class DeliveryAgentsService {
  constructor(
    @InjectRepository(DeliveryAgent)
    private readonly deliveryAgentsRepository: Repository<DeliveryAgent>,
    private readonly usersService: UsersService
  ) {}

  async createDeliveryAgent(createUserDto: CreateDeliveryAgentDto) {
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
      vehicle_type,
    } = createUserDto;

    const createdDeliveryAgent = await this.insertOne({
      first_name,
      last_name,
      phone_number,
      siret,
      company_address,
      company_name,
      company_city,
      vehicle_type,
    });

    const insertedUser = await this.usersService.insertOneDeliveryAgent(
      {
        email,
        password: "",
        user_type: UserType.DELIVERY_AGENT,
      },
      createdDeliveryAgent
    );

    await this.updateOneById(insertedUser.service_agent.id, {
      user_id: insertedUser.id,
    });

    //TODO: send email to service agent with token_request for reset password
  }

  /* Db requests */
  async findOne(id: number): Promise<DeliveryAgent> {
    return this.deliveryAgentsRepository.findOne({ where: { id } });
  }

  findOneBySiret(siret: string): Promise<DeliveryAgent> {
    return this.deliveryAgentsRepository.findOne({
      where: { siret },
    });
  }

  async insertOne(
    deliveryAgentToCreate: Pick<
      DeliveryAgent,
      | "first_name"
      | "last_name"
      | "phone_number"
      | "siret"
      | "company_address"
      | "company_name"
      | "company_city"
      | "vehicle_type"
    >
  ) {
    const deliveryAgent = this.deliveryAgentsRepository.create(
      deliveryAgentToCreate
    );
    return this.deliveryAgentsRepository.save(deliveryAgent);
  }

  async updateOneById(
    id: number,
    dataToUpdate: Partial<DeliveryAgent>
  ): Promise<DeliveryAgent> {
    await this.deliveryAgentsRepository.update(id, dataToUpdate);

    return this.deliveryAgentsRepository.findOne({ where: { id } });
  }
}
