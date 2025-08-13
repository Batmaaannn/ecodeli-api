import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ServiceAgent } from "./entities/service-agents.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { UserType } from "src/types/user";
import { CreateUserServiceAgentDto } from "./dto/create-user-service-agent.dto";
import { FilesService } from "../files/files.service";
import { FileTargetType } from "src/types/file";
import { convertToMulterFile } from "src/utils/file-storage/convert";
import { PrestationsService } from "../prestations/prestations.service";

@Injectable()
export class ServiceAgentsService {
  constructor(
    @InjectRepository(ServiceAgent)
    private readonly serviceAgentsRepository: Repository<ServiceAgent>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
    private readonly prestationsService: PrestationsService
  ) {}

  async createServiceAgent(createUserDto: CreateUserServiceAgentDto) {
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
      //certifications,
      selectedPrestations,
    } = createUserDto;

    const createdServiceAgent = await this.insertOne({
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      siret: companySiret,
      company_address: companyAddress,
      company_name: companyName,
      company_city: companyCity,
      certifications: '',
    });

    const insertedUser = await this.usersService.insertOneServiceAgent(
      {
        email,
        password,
        user_type: UserType.SERVICE_AGENT,
      },
      createdServiceAgent
    );

    await this.updateOneById(insertedUser.service_agent.id, {
      user_id: insertedUser.id,
    });

    await this.prestationsService.createServiceAgentPrestations(
      createdServiceAgent.id,
      selectedPrestations
    );

    const finalConvertedFiles = files.map((file) => convertToMulterFile(file));

    await this.filesService.createFile({
      files: finalConvertedFiles,
      targetId: createdServiceAgent.id,
      targetType: FileTargetType.REGISTRATION_REQUEST,
      userId: insertedUser.id,
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
      | "certifications"
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
