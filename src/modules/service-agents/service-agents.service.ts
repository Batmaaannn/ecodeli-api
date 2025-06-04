import { Injectable } from "@nestjs/common";
import { ServiceAgent } from "./entities/service-agents.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ServiceAgentsService {
  constructor(
    @InjectRepository(ServiceAgent)
    private readonly serviceAgentsRepository: Repository<ServiceAgent>
  ) {}

  /* Db requests */
  async findOne(id: number): Promise<ServiceAgent> {
    return this.serviceAgentsRepository.findOne({ where: { id } });
  }
}
