import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { WarehouseStorage } from "../../storages/entities/warehouse-storage.entity";
import { CustomerStorageBox } from "../../storages/entities/customer-storage-box.entity";

@Entity("warehouses")
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column("decimal", { precision: 10, scale: 6, nullable: true })
  latitude?: number;

  @Column("decimal", { precision: 10, scale: 6, nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  postal_code?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  telephone?: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  // Relations

  @OneToMany(() => WarehouseStorage, (storage) => storage.warehouse)
  storages: WarehouseStorage[];

  @OneToMany(() => CustomerStorageBox, (storageBox) => storageBox.warehouse)
  storageBoxes: CustomerStorageBox[];
}
