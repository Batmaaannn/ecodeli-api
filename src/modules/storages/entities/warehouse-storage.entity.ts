import { Package } from "src/modules/deliveries/entities/package.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Warehouse } from "../../warehouses/entities/warehouse.entity";

@Entity("warehouse_storage")
export class WarehouseStorage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  capacity: number;

  @Column()
  is_available: boolean;

  // Relations

  @OneToMany(() => Package, (packageEntity) => packageEntity.warehouse)
  packages: Package[];

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.storages)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;
  @Column()
  warehouse_id: number;
}
