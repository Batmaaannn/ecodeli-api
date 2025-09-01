import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerStorageBox } from './entities/customer-storage-box.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseStorage } from './entities/warehouse-storage.entity';
import { BoxSize } from 'src/types/box';
import { StoragesService } from './storages.service';
import { BoxDto } from './dto/box.dto';
import { Public } from '../auth/decorator/public.decorator';

type BoxType = {
  warehouseId: number;
  size?: BoxSize;
  rentalStart: Date;
  rentalEnd: Date;
}

type RentalType = {
  boxId: number;
  additionalDays: number;
}

@Controller('storages')
export class StoragesController {
  constructor(
    private readonly storageService: StoragesService,
    @InjectRepository(CustomerStorageBox)
    private readonly customerStorageBoxRepository: Repository<CustomerStorageBox>,
    @InjectRepository(WarehouseStorage)
    private readonly warehouseStorageRepository: Repository<WarehouseStorage>,
  ) { }

  /**
   * Permet de récupérer toutes les boxs disponibles.
   */
  @Get("/get-available-boxes")
  async getAvailableBoxes({ warehouseId, size, rentalStart, rentalEnd }: BoxType) {
    return this.storageService.findAvailableBoxes({ warehouseId, size, rentalStart, rentalEnd });
  }

  /**
   * Créé une réservation de box.
   */
  @Post("/create-reservation-box")
  async createReservationBox(@Body() boxDto: BoxDto) {
    const {warehouseId, size, rentalStart, rentalEnd } = boxDto;

    const foundWarehouse = await this.warehouseStorageRepository.findOneBy({
      id: warehouseId
    });

    this.customerStorageBoxRepository.create({
      warehouse: foundWarehouse,
      box_size: size,
      rental_start: rentalStart,
      rental_end: rentalEnd
    });
  }

  async extendRental({ boxId, additionalDays }: RentalType) {
    // 
  }
}
