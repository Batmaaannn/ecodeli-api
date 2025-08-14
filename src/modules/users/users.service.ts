import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import {
  CustomerUser,
  DeliveryAgentUser,
  MerchantUser,
  ServiceAgentUser,
} from "src/types/user";
import { Customer } from "../customers/entities/customer.entity";
import { Merchant } from "../merchants/entities/merchants.entity";
import { ServiceAgent } from "../service-agents/entities/service-agents.entity";
import { DeliveryAgent } from "../delivery-agents/entities/delivery-agents.entity";
import { getFileSignedUrl } from "src/utils/file-storage/s3";
import config from "src/config";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async getMyUser(id: number): Promise<any> {
    return this.findOneByIdWithAllRelations(+id);
  }

  async getUser(id: number): Promise<Omit<User, "password">> {
    return this.findOneById(+id);
  }

  /* Db requests */
  async findOneById(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByIdWithAllRelations(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ["customer", "merchant", "delivery_agent", "service_agent"],
    });
  }

  async findUsersRequestsNotValidated(): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ is_validated: false }],
      relations: ["delivery_agent", "service_agent", "merchant"],
    });
  }

  async insertOneCustomer(
    customerToCreate: Pick<
      CustomerUser,
      "email" | "password" | "user_type" | "is_validated"
    >,
    customer: Customer
  ): Promise<User> {
    const user = this.usersRepository.create({
      ...customerToCreate,
      email: customerToCreate.email.toLowerCase(),
      customer,
      is_validated: customerToCreate.is_validated,
    });

    return this.usersRepository.save(user);
  }

  async insertOneMerchant(
    merchantToCreate: Pick<
      MerchantUser,
      "email" | "password" | "user_type" | "is_validated"
    >,
    merchant: Merchant
  ): Promise<User> {
    const user = this.usersRepository.create({
      ...merchantToCreate,
      email: merchantToCreate.email.toLowerCase(),
      is_validated: merchantToCreate.is_validated,
      merchant,
    });

    return this.usersRepository.save(user);
  }

  async insertOneServiceAgent(
    serviceAgentToCreate: Pick<
      ServiceAgentUser,
      "email" | "password" | "user_type"
    >,
    serviceAgent: ServiceAgent
  ): Promise<User> {
    const user = this.usersRepository.create({
      ...serviceAgentToCreate,
      email: serviceAgentToCreate.email.toLowerCase(),
      service_agent: serviceAgent,
    });

    return this.usersRepository.save(user);
  }

  async insertOneDeliveryAgent(
    deliveryAgentToCreate: Pick<
      DeliveryAgentUser,
      "email" | "password" | "user_type"
    >,
    deliveryAgent: DeliveryAgent
  ): Promise<User> {
    const user = this.usersRepository.create({
      ...deliveryAgentToCreate,
      email: deliveryAgentToCreate.email.toLowerCase(),
      delivery_agent: deliveryAgent,
    });

    return this.usersRepository.save(user);
  }
}
