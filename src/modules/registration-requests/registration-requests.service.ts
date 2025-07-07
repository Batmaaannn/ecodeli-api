import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { RegistrationRequest } from "./entities/registration-requests.entity";
import { CreateServiceAgentRequestDto } from "./dto/create-registration-service-agent.dto";
import { v4 as uuidv4 } from "uuid";
import { AgentType } from "src/types/user";
import { CreateDeliveryAgentRequestDto } from "./dto/create-registration-delivery-agent.dto";
import { sendRegistrationRequest } from "src/utils/emails";
import { PrestationRegistrationRequest } from "./entities/prestation-registration-request.entity";
import { FilesService } from "../files/files.service";

@Injectable()
export class RegistrationRequestsService {
  constructor(
    @InjectRepository(RegistrationRequest)
    private registrationRequestRepository: Repository<RegistrationRequest>,
    @InjectRepository(PrestationRegistrationRequest)
    private prestationRegistrationRequest: Repository<PrestationRegistrationRequest>,
    private usersService: UsersService,
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
        fileName,
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
    const { firstName, lastName, email, phoneNumber } =
      createDeliveryAgentRequestDto;

    const token_request = uuidv4();

    // await this.insertOneDeliveryAgentRequest({
    //   first_name: firstName,
    //   last_name: lastName,

    //   is_processed: false,
    //   token_request,
    //   agent_type: AgentType.DELIVERY_AGENT,
    // });

    await sendRegistrationRequest({
      tokenRequest: token_request,
      fullName: `${firstName} ${lastName}`,
      agentType: AgentType.DELIVERY_AGENT,
      email,
      phone: phoneNumber,
    });

    return;
  }

  /* Db Request */

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

  findOneByDrivingLicence(
    driving_license: string
  ): Promise<RegistrationRequest> {
    return this.registrationRequestRepository.findOne({
      where: { driving_license },
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
      | "driving_license"
      | "agent_type"
      | "vehicle_type"
      | "token_request"
    >
  ): Promise<RegistrationRequest> {
    return this.registrationRequestRepository.save(deliveryAgentToCreate);
  }

  // Update pharmacistRequest when validation form
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
