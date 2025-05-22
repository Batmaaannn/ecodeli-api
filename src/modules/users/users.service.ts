import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { CustomerUser, MerchantUser } from "src/types/user";
import { Customer } from "../customers/entities/customer.entity";
import { Merchant } from "../merchants/entities/merchants.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async getMyUser(id: number | string) {
    return this.findOneByIdWithAllRelations(+id);
  }

  async getUser(id: number | string): Promise<Omit<User, "password">> {
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
    });
  }

  async insertOneCustomer(
    customerToCreate: Pick<CustomerUser, "email" | "password" | "user_type">,
    customer: Customer
  ): Promise<User> {
    const user = this.usersRepository.create({
      ...customerToCreate,
      email: customerToCreate.email.toLowerCase(),
      customer,
    });

    return this.usersRepository.save(user);
  }

  async insertOneMerchant(
    merchantToCreate: Pick<MerchantUser, "email" | "password" | "user_type">,
    merchant: Merchant
  ): Promise<User> {
    const user = this.usersRepository.create({
      ...merchantToCreate,
      email: merchantToCreate.email.toLowerCase(),
      merchant,
    });

    return this.usersRepository.save(user);
  }
}
