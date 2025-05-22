import { Injectable } from "@nestjs/common";
import { Merchant } from "./entities/merchants.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { Repository } from "typeorm";
import { CreateUserMerchantDto } from "./dto/create-user-merchant.dto";
import { UserType } from "src/types/user";

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantsRepository: Repository<Merchant>,
    private readonly usersService: UsersService
  ) {}

  async createMerchant(createUserDto: CreateUserMerchantDto) {
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      siret,
      company_address,
      company_name,
      company_city,
    } = createUserDto;

    const createdMerchant = await this.insertOne({
      first_name,
      last_name,
      phone_number,
      siret,
      company_address,
      company_name,
      company_city,
    });

    const insertedUser = await this.usersService.insertOneMerchant(
      {
        email,
        password,
        user_type: UserType.MERCHANT,
      },
      createdMerchant
    );

    await this.updateOneById(insertedUser.merchant_id, {
      user_id: insertedUser.id,
    });
  }

  /* Db Requests */

  findOneBySiret(siret: string): Promise<Merchant> {
    return this.merchantsRepository.findOne({
      where: { siret },
    });
  }

  async insertOne(
    merchantToCreate: Pick<
      Merchant,
      | "first_name"
      | "last_name"
      | "phone_number"
      | "siret"
      | "company_address"
      | "company_name"
      | "company_city"
    >
  ) {
    const merchant = this.merchantsRepository.create(merchantToCreate);
    return this.merchantsRepository.save(merchant);
  }

  async updateOneById(
    id: number,
    dataToUpdate: Partial<Merchant>
  ): Promise<Merchant> {
    await this.merchantsRepository.update(id, dataToUpdate);

    return this.merchantsRepository.findOne({ where: { id } });
  }
}
