import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { RegistrationRequest } from "./entities/registration-requests.entity";
import { v4 as uuidv4 } from "uuid";
import { AgentType } from "src/types/user";
import { CreateDeliveryAgentRequestDto } from "./dto/create-registration-delivery-agent.dto";
import { sendRegistrationRequest } from "src/utils/emails/index.old";
import { PrestationRegistrationRequest } from "./entities/prestation-registration-request.entity";
import { FilesService } from "../files/files.service";
import { FileTargetType } from "src/types/file";
import { UpdateStatusRequestDto } from "./dto/update-status-registration.dto";
import { Statut } from "src/types/statut";
import { ServiceAgentsService } from "../service-agents/service-agents.service";
import { CreateUserFromRegistrationRequestDto } from "./dto/create-user-registation-request.dto";
import { CreateServiceAgentDto } from "../service-agents/dto/create-user-service-agent.dto";
import { CreateDeliveryAgentDto } from "../delivery-agents/dto/create-user-delivery-agent.dto";
import { DeliveryAgentsService } from "../delivery-agents/delivery-agents.service";

@Injectable()
export class RegistrationRequestsService {
  constructor(
    @InjectRepository(RegistrationRequest)
    private registrationRequestRepository: Repository<RegistrationRequest>,
    @InjectRepository(PrestationRegistrationRequest)
    private prestationRegistrationRequest: Repository<PrestationRegistrationRequest>,
    private serviceAgentsService: ServiceAgentsService,
    private deliveryAgentsService: DeliveryAgentsService,

    private filesService: FilesService
  ) {}

  async createServiceAgentRequest(newRegistrationRequestInfo: any) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      companyAddress,
      companyCity,
      companyName,
      prestations,
      files,
      fileName,
    } = newRegistrationRequestInfo;

    const tokenRequest = uuidv4();

    const registrationRequest = await this.insertOneServiceAgentRequest({
      ...newRegistrationRequestInfo,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      company_name: companyName,
      company_address: companyAddress,
      company_city: companyCity,
      token_request: tokenRequest,
      agent_type: AgentType.SERVICE_AGENT,
    });

    const linksToInsert = prestations.map(({ prestationId, price }) =>
      this.prestationRegistrationRequest.create({
        registrationRequest,
        prestation: { id: prestationId },
        price,
      })
    );

    await this.prestationRegistrationRequest.save(linksToInsert);

    if (files?.length > 0) {
      await this.filesService.createRegistrationRequestFile({
        files,
        tokenRequest,
        registrationRequestId: registrationRequest.id,
      });
    }

    // await sendRegistrationRequest({
    //   tokenRequest: token_request,
    //   fullName: `${firstName} ${lastName}`,
    //   agentType: AgentType.SERVICE_AGENT,
    //   email,
    //   phone: phoneNumber,
    // });

    return;
  }

  async createDeliveryAgentRequest(
    createDeliveryAgentRequestDto: CreateDeliveryAgentRequestDto
  ) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      companyAddress,
      companyCity,
      companyName,
      files,
      vehiculeType,
    } = createDeliveryAgentRequestDto;

    const tokenRequest = uuidv4();

    const registrationRequest = await this.insertOneDeliveryAgentRequest({
      ...createDeliveryAgentRequestDto,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      company_name: companyName,
      company_address: companyAddress,
      company_city: companyCity,
      token_request: tokenRequest,
      agent_type: AgentType.DELIVERY_AGENT,
      vehicle_type: vehiculeType,
    });

    if (files?.length > 0) {
      await this.filesService.createRegistrationRequestFile({
        files,
        tokenRequest,
        registrationRequestId: registrationRequest.id,
      });
    }

    // await sendRegistrationRequest({
    //   tokenRequest: tokenRequest,
    //   fullName: `${firstName} ${lastName}`,
    //   agentType: AgentType.DELIVERY_AGENT,
    //   email,
    //   phone: phoneNumber,
    // });

    return;
  }

  async getRegistrationRequestById(id: number): Promise<any> {
    const registrationRequest = await this.findOneByIdWithRelations(id);

    if (!registrationRequest) {
      throw new HttpException(
        `Registration request not found`,
        HttpStatus.NOT_FOUND
      );
    }

    const documents = await this.filesService.getFilesByTargetTypeAndId(
      FileTargetType.REGISTRATION_REQUEST,
      registrationRequest.id
    );

    return {
      ...registrationRequest,
      documents,
    };
  }

  // async updateRegistrationRequestStatus(
  //   id: number,
  //   { status }: UpdateStatusRequestDto
  // ): Promise<void> {
  //   const request = await this.findOneByIdWithRelations(id);
  //   if (!request) {
  //     throw new HttpException(
  //       "Registration request not found",
  //       HttpStatus.NOT_FOUND
  //     );
  //   }

  //   const newStatus = status ? Statut.ACCEPTED : Statut.REJECTED;

  //   await this.registrationRequestRepository.update(
  //     { id },
  //     { statut: newStatus }
  //   );

  //   if (
  //     newStatus === Statut.ACCEPTED &&
  //     request.agent_type === AgentType.SERVICE_AGENT
  //   ) {
  //     await this.serviceAgentsService.createServiceAgent(request);
  //   }
  // }

  async validateAgent(createUserDto: CreateUserFromRegistrationRequestDto) {
    const { agent_type, statut } = createUserDto;

    //TODO: change prestations
    if (agent_type === AgentType.SERVICE_AGENT) {
      const serviceAgentDto: CreateServiceAgentDto = {
        siret: createUserDto.siret,
        token_request: createUserDto.token_request,
        email: createUserDto.email,
        company_name: createUserDto.company_name,
        company_address: createUserDto.company_address,
        company_city: createUserDto.company_city,
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        phone_number: createUserDto.phone_number,
      };

      return this.serviceAgentsService.createServiceAgent(serviceAgentDto);
    } else if (agent_type === AgentType.DELIVERY_AGENT) {
      const deliveryAgentDto: CreateDeliveryAgentDto = {
        siret: createUserDto.siret,
        token_request: createUserDto.token_request,
        email: createUserDto.email,
        company_name: createUserDto.company_name,
        company_address: createUserDto.company_address,
        company_city: createUserDto.company_city,
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        phone_number: createUserDto.phone_number,
        vehicle_type: createUserDto.vehicle_type,
      };

      return this.deliveryAgentsService.createDeliveryAgent(deliveryAgentDto);
    }

    await this.registrationRequestRepository.update(
      { token_request: createUserDto.token_request },
      { statut: Statut.ACCEPTED }
    );

    return;
  }

  async rejectRegistrationRequest(id: number) {
    await this.registrationRequestRepository.update(
      { id },
      { statut: Statut.REJECTED }
    );

    return;
  }

  /* Db Request */

  findAll(): Promise<RegistrationRequest[]> {
    return this.registrationRequestRepository.find({
      order: { created_at: "DESC" },
    });
  }

  findOneByIdWithRelations(id: number): Promise<RegistrationRequest> {
    return this.registrationRequestRepository.findOne({
      where: { id },
      relations: ["prestationLinks", "prestationLinks.prestation"],
    });
  }

  findOneByEmail(email: string): Promise<RegistrationRequest> {
    return this.registrationRequestRepository.findOne({
      where: { email },
    });
  }

  findOneBySiret(siret: string): Promise<RegistrationRequest> {
    return this.registrationRequestRepository.findOne({
      where: { siret },
    });
  }

  async insertOneServiceAgentRequest(
    serviceAgentToCreate: Pick<
      RegistrationRequest,
      | "siret"
      | "first_name"
      | "last_name"
      | "email"
      | "phone_number"
      | "company_name"
      | "company_address"
      | "company_city"
      | "agent_type"
      | "token_request"
    >
  ): Promise<RegistrationRequest> {
    return this.registrationRequestRepository.save(serviceAgentToCreate);
  }

  async insertOneDeliveryAgentRequest(
    deliveryAgentToCreate: Pick<
      RegistrationRequest,
      | "siret"
      | "first_name"
      | "last_name"
      | "email"
      | "phone_number"
      | "company_name"
      | "company_address"
      | "company_city"
      | "agent_type"
      | "token_request"
      | "vehicle_type"
    >
  ): Promise<RegistrationRequest> {
    return this.registrationRequestRepository.save(deliveryAgentToCreate);
  }

  async updateServiceAgentRequest(
    token_request: string,
    pharmacistToUpdate: Pick<
      RegistrationRequest,
      | "siret"
      | "first_name"
      | "last_name"
      | "email"
      | "phone_number"
      | "company_name"
      | "company_address"
      | "company_city"
      | "agent_type"
      | "token_request"
    >
  ) {
    await this.registrationRequestRepository.update(
      { token_request },
      pharmacistToUpdate
    );
  }
}
