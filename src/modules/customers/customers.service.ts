import { Inject, Injectable } from "@nestjs/common";
import { CreateUserCustomerDto } from "./dto/create-user-customer.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "./entities/customer.entity";
import { Repository } from "typeorm";
import { UserType } from "src/types/user";
import { UsersService } from "../users/users.service";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    private readonly usersService: UsersService
  ) {}

  async createCustomer(createUserDto: CreateUserCustomerDto) {
    const { first_name, last_name, email, password } = createUserDto;

    const createdCustomer = await this.insertOne({
      first_name,
      last_name,
    });

    const insertedUser = await this.usersService.insertOneCustomer(
      {
        email,
        password,
        user_type: UserType.CUSTOMER,
      },
      createdCustomer
    );

    await this.updateOneById(insertedUser.customer_id, {
      user_id: insertedUser.id,
    });
  }

  /* Db Requests */

  async insertOne(
    customerToCreate: Pick<Customer, "first_name" | "last_name">
  ) {
    const customer = this.customersRepository.create(customerToCreate);
    return this.customersRepository.save(customer);
  }

  async updateOneById(
    id: number,
    dataToUpdate: Partial<Customer>
  ): Promise<Customer> {
    await this.customersRepository.update(id, dataToUpdate);

    return this.customersRepository.findOne({ where: { id } });
  }
}
