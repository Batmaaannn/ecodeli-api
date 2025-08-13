import { Injectable } from "@nestjs/common";
import { DeliveryAgent } from "./entities/delivery-agents.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { UserType } from "src/types/user";
import { CreateUserDeliveryAgentDto } from "./dto/create-user-delivery-agent.dto";
import { FilesService } from "../files/files.service";
import { FileTargetType } from "src/types/file";

@Injectable()
export class DeliveryAgentsService {
  constructor(
    @InjectRepository(DeliveryAgent)
    private readonly deliveryAgentsRepository: Repository<DeliveryAgent>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService
  ) {}

  async createDeliveryAgent(createUserDto: CreateUserDeliveryAgentDto) {
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
      licenseNumber,
      vehiculeType,
    } = createUserDto;

    const createdDeliveryAgent = await this.insertOne({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      siret: companySiret,
      company_address: companyAddress,
      company_name: companyName,
      company_city: companyCity,
      license_number: licenseNumber,
      vehicle_type: vehiculeType,
    });

    const insertedUser = await this.usersService.insertOneDeliveryAgent(
      {
        email,
        password: password,
        user_type: UserType.DELIVERY_AGENT,
      },
      createdDeliveryAgent
    );

    await this.updateOneById(insertedUser.delivery_agent.id, {
      user_id: insertedUser.id,
    });

    if (files?.length > 0) {
      await this.filesService.createFile({
        files,
        id: createdDeliveryAgent.id,
        targetType: FileTargetType.REGISTRATION_REQUEST,
      });
    }
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

  findOneByLicense(license: string): Promise<DeliveryAgent> {
    return this.deliveryAgentsRepository.findOne({
      where: { license_number: license },
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
      | "license_number"
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
