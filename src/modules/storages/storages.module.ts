import { Module } from "@nestjs/common";
import { StoragesController } from "./storages.controller";
import { StoragesService } from "./storages.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WarehouseStorage } from "./entities/warehouse-storage.entity";
import { CustomerStorageBox } from "./entities/customer-storage-box.entity";
import { Warehouse } from "../warehouses/entities/warehouse.entity";

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseStorage, CustomerStorageBox])],
  controllers: [StoragesController],
  providers: [StoragesService],
  exports: [StoragesService],
})
export class StoragesModule {}
