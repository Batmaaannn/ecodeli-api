import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';

@Controller('warehouses')
export class WarehousesController {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warhousesRepository: Repository<Warehouse>
  ) {}

  /**
   * Permet de récupérer les entrepôts.
   */
  async getWarehouses(): Promise<Warehouse[]> {
    return await this.warhousesRepository.find();
  }
}
