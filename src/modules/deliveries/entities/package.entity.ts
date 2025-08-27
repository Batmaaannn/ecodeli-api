import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Delivery } from "./delivery.entity";
import { WarehouseStorage } from "src/modules/storages/entities/warehouse-storage.entity";

@Entity({ name: "packages" })
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 8, scale: 3 })
  weight: number; //kg

  @Column({ nullable: true })
  length: number; //cm

  @Column({ nullable: true })
  width: number; //cm

  @Column({ nullable: true })
  height: number; //cm

  @Column()
  quantity: number;

  @Column({ nullable: true })
  photos: string;

  @Column({ nullable: true })
  fragile: boolean;

  @ManyToOne(() => Delivery, (delivery) => delivery.packages)
  @JoinColumn({ name: "delivery_id" })
  delivery: Delivery;
  @Column({ nullable: true })
  delivery_id: number;

  @ManyToOne(() => WarehouseStorage, (warehouse) => warehouse.packages)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: WarehouseStorage;
  @Column({ nullable: true })
  warehouse_id: number;
}
