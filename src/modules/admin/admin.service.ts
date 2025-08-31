import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ServiceAgent } from '../service-agents/entities/service-agents.entity';
import { ServiceAgentPrestation } from '../prestations/entities/service-agent-prestation.entity';
import { Prestation } from '../prestations/entities/prestations.entity';
import { DeliveryAgent } from '../delivery-agents/entities/delivery-agents.entity';
import { PrestationStatus } from 'src/types/prestation';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(ServiceAgent)
    private serviceAgentRepository: Repository<ServiceAgent>,
    @InjectRepository(ServiceAgentPrestation)
    private serviceAgentPrestationRepository: Repository<ServiceAgentPrestation>,
    @InjectRepository(Prestation)
    private prestationRepository: Repository<Prestation>,
    @InjectRepository(DeliveryAgent)
    private deliveryAgentRepository: Repository<DeliveryAgent>,
  ) {}

  async fetchDeliveryAgentById(id: number) {
    return await this.deliveryAgentRepository.findOne({
      where: { id },
      relations: ['user', 'files']
    });
  }

  async getServiceAgentById(id: number) {
    return await this.serviceAgentRepository.findOne({
      where: { id },
      relations: ['user', 'serviceAgentPrestations', 'serviceAgentPrestations.prestation']
    });
  }

  async updateServiceAgentPrestations(serviceAgentId: number, prestations: Array<{
    id: number;
    applied_price: number;
    is_available: boolean;
    price_status: string;
    ecodeli_comment: string;
  }>) {
    for (const prestation of prestations) {
      await this.serviceAgentPrestationRepository.update(prestation.id, {
        applied_price: prestation.applied_price,
        is_available: prestation.is_available,
        price_status: prestation.price_status as any,
        ecodeli_comment: prestation.ecodeli_comment
      });
    }
    return { success: true };
  }

async addServiceAgentPrestation(serviceAgentId: number, data: {
  prestationId: number;
  requested_price: number;
}) {
  const newPrestation = this.serviceAgentPrestationRepository.create({
    service_agent_id: serviceAgentId,  
    prestation_id: data.prestationId,  
    requested_price: data.requested_price,
    applied_price: 0,
    price_status: PrestationStatus.PENDING,  
    is_available: true
  });
  return await this.serviceAgentPrestationRepository.save(newPrestation);
}

  async getAllPrestations() {
    return await this.prestationRepository.find();
  }

  async updatePrestationStatus(prestationId: number, isActive: boolean) {
    return await this.prestationRepository.update(prestationId, { is_active: isActive });
  }

  async acceptUserRequest(id: number) {
    return await this.usersService.acceptUserRequest(id);
  }

  async rejectUserRequest(id: number) {
    return await this.usersService.rejectUserRequest(id);
  }

  async updateFileStatus(id: number, data: any) {

    throw new Error('Method not implemented');
  }
}