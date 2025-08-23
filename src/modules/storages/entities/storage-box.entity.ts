import { Customer } from "src/modules/customers/entities/customer.entity";
import { Package } from "src/modules/deliveries/entities/package.entity";
import { BoxSize } from "src/types/box";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

@Entity("storage_boxes")
export class StorageBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  box_location: string; // paris|marseille|lyon|lille|montpellier|rennes

  @Column({
    type: "enum",
    enum: BoxSize,
  })
  box_size: BoxSize;

  @Column({ default: false })
  is_occupied: boolean;

  @Column({ nullable: true })
  rental_start: Date;

  @Column({ nullable: true })
  rental_end: Date;

  @ManyToOne(() => Customer, (customer) => customer.storageBoxes)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;
  @Column()
  customer_id: number;

  @OneToMany(() => Package, (packageEntity) => packageEntity.storageBox)
  packages: Package[];
}
