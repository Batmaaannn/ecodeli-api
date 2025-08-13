import { Injectable } from "@nestjs/common";
import { Prestation } from "./entities/prestations.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePrestationDto } from "./dto/create-prestation.dto";
import { ServiceAgentPrestation } from "./entities/service-agent-prestation.entity";

@Injectable()
export class PrestationsService {
  constructor(
    @InjectRepository(Prestation)
    private readonly prestationsRepository: Repository<Prestation>,
    @InjectRepository(ServiceAgentPrestation)
    private readonly serviceAgentPrestationsRepository: Repository<ServiceAgentPrestation>
  ) {}

  async create(createPrestationDto: CreatePrestationDto) {
    const prestation = this.prestationsRepository.create(createPrestationDto);
    return this.prestationsRepository.save(prestation);
  }

  async createServiceAgentPrestations(
    serviceAgentId: number,
    prestations: { prestationId: string; requestedPrice: string }[]
  ): Promise<ServiceAgentPrestation[]> {
    const serviceAgentPrestations = prestations.map((prestation) =>
      this.serviceAgentPrestationsRepository.create({
        service_agent_id: serviceAgentId,
        prestation_id: Number(prestation.prestationId),
        requested_price: Number(prestation.requestedPrice),
      })
    );

    return this.serviceAgentPrestationsRepository.save(serviceAgentPrestations);
  }

  /* Db requests */
  async findAll(): Promise<Prestation[]> {
    return this.prestationsRepository.find();
  }
}
