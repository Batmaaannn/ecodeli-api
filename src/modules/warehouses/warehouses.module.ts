import { Module } from "@nestjs/common";
import { WarehousesController } from "./warehouses.controller";
import { WarehousesService } from "./warehouses.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Warehouse } from "./entities/warehouse.entity";
import { WarehouseInventory } from "./entities/warehouse-inventory.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, WarehouseInventory])],
  controllers: [WarehousesController],
  providers: [WarehousesService],
})
export class WarehousesModule {}
