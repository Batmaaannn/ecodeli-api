import { Injectable } from "@nestjs/common";
import { Merchant } from "./entities/merchants.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { Repository } from "typeorm";
import { CreateUserMerchantDto } from "./dto/create-user-merchant.dto";
import { UserType } from "src/types/user";
import { FilesService } from "../files/files.service";

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantsRepository: Repository<Merchant>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService
  ) {}

  async createMerchant(createUserDto: CreateUserMerchantDto) {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      companySiret,
      companyAddress,
      companyName,
      companyCity,
      files,
    } = createUserDto;

    const createdMerchant = await this.insertOne({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      siret: companySiret,
      company_address: companyAddress,
      company_name: companyName,
      company_city: companyCity,
    });

    const insertedUser = await this.usersService.insertOneMerchant(
      {
        email,
        password,
        user_type: UserType.MERCHANT,
        is_validated: true
      },
      createdMerchant
    );

    await this.updateOneById(insertedUser.merchant_id, {
      user_id: insertedUser.id,
    });

    if (files?.length > 0) {
      await this.filesService.createMerchantFile({
        files,
        merchantId: createdMerchant.id,
      });
    }
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
