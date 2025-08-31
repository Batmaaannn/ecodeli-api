import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerStorageBox } from './entities/customer-storage-box.entity';
import { WarehouseStorage } from './entities/warehouse-storage.entity';
import { Repository } from 'typeorm';
import { BoxSize } from 'src/types/box';

type BoxType = {
  warehouseId: number;
  size?: BoxSize;
  rentalStart: Date;
  rentalEnd: Date;
}

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(CustomerStorageBox)
    private readonly customerStorageBoxRepository: Repository<CustomerStorageBox>,
    @InjectRepository(WarehouseStorage)
    private readonly warehouseStorageRepository: Repository<WarehouseStorage>,
  ) { }

  async findAvailableBoxes({ warehouseId, size, rentalStart, rentalEnd }: BoxType) {
    const foundWarehouse = await this.warehouseStorageRepository.findBy({
      id: warehouseId
    });

    return await this.customerStorageBoxRepository.findBy({
      warehouse: foundWarehouse,
      box_size: size,
      rental_start: rentalStart,
      rental_end: rentalEnd
    });
  }
}
