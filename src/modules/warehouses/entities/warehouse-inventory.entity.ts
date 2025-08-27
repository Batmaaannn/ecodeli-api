import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Warehouse } from "./warehouse.entity";
import { BoxSize } from "src/types/box";

@Entity("warehouses_inventory")
export class WarehouseInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ type: "enum", enum: BoxSize })
  box_size: BoxSize;

  @Column()
  total_quantity: number;

  @Column()
  available_quantity: number;

  @Column()
  reserved_quantity: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  // Relations

  @ManyToOne(() => Warehouse)
  warehouse: Warehouse;
}
