import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { RegistrationRequest } from "./entities/registration-requests.entity";
import { CreateServiceAgentRequestDto } from "./dto/create-registration-service-agent.dto";
import { v4 as uuidv4 } from "uuid";
import { AgentType } from "src/types/user";
import { CreateDeliveryAgentRequestDto } from "./dto/create-registration-delivery-agent.dto";

@Injectable()
export class RegistrationRequestsService {
  constructor(
    @InjectRepository(RegistrationRequest)
    private registrationRequestRepository: Repository<RegistrationRequest>,
    private usersService: UsersService
  ) {}

  async createServiceAgentRequest(
    createServiceAgentRequestDto: CreateServiceAgentRequestDto
  ) {
    const { siret, first_name, last_name, email, phone_number } =
      createServiceAgentRequestDto;

    const token_request = uuidv4();

    await this.insertOneServiceAgentRequest({
      ...createServiceAgentRequestDto,
      is_processed: false,
      token_request,
      agent_type: AgentType.SERVICE_AGENT,
    });

    // await sendValidationRequestPharmacist({
    //   tokenPharmacist: token_pharmacist,
    //   fullName: `${first_name} ${last_name}`,
    //   siret,
    //   email,
    //   phone_number,
    // });

    return;
  }

  async createDeliveryAgentRequest(
    createDeliveryAgentRequestDto: CreateDeliveryAgentRequestDto
  ) {
    const { siret, first_name, last_name, email, phone_number } =
      createDeliveryAgentRequestDto;

    const token_request = uuidv4();

    await this.insertOneDeliveryAgentRequest({
      ...createDeliveryAgentRequestDto,
      is_processed: false,
      token_request,
      agent_type: AgentType.DELIVERY_AGENT,
    });

    // await sendValidationRequestPharmacist({
    //   tokenPharmacist: token_pharmacist,
    //   fullName: `${first_name} ${last_name}`,
    //   siret,
    //   email,
    //   phone_number,
    // });

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
      | "prestations"
      | "is_processed"
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
      | "is_processed"
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
      | "prestations"
      | "is_processed"
      | "token_request"
    >
  ) {
    await this.registrationRequestRepository.update(
      { token_request },
      pharmacistToUpdate
    );
  }
}
