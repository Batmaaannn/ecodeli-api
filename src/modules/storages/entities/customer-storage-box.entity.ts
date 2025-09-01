import { Customer } from "src/modules/customers/entities/customer.entity";
import { BoxSize } from "src/types/box";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Warehouse } from "../../warehouses/entities/warehouse.entity";

@Entity("customer_storage_boxes")
export class CustomerStorageBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: BoxSize,
  })
  box_size: BoxSize;

  @Column({ nullable: true })
  rental_start: Date;

  @Column({ nullable: true })
  rental_end: Date;

  @Column({ nullable: true })
  monthly_fee: number;

  // Relations

  @ManyToOne(() => Customer, (customer) => customer.storageBoxes)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;
  
  @Column()
  customer_id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.storageBoxes)
  @JoinColumn({ name: "warehouse_id" })
  warehouse: Warehouse;
}
