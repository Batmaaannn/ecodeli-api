import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Merchant } from "./merchants.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Delivery } from "src/modules/deliveries/entities/delivery.entity";

export enum MerchantDeliveryStatus {
  PENDING = "pending",
  ASSIGNED = "assigned",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

@Entity({ name: "merchant_deliveries" })
export class MerchantDelivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order_reference: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  order_amount: number;

  @Column()
  pickup_address: string;

  @Column()
  delivery_address: string;

  @Column()
  customer_name: string;

  @Column()
  customer_phone: string;

  @Column({ nullable: true })
  customer_email: string;

  @Column({
    type: "enum",
    enum: MerchantDeliveryStatus,
    default: MerchantDeliveryStatus.PENDING,
  })
  status: MerchantDeliveryStatus;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  delivery_fee: number;

  @Column({ nullable: true })
  preferred_delivery_date: Date;

  @Column({ nullable: true })
  preferred_delivery_time_slot: string;

  @ManyToOne(() => Merchant, { onDelete: "CASCADE" })
  @JoinColumn({ name: "merchant_id" })
  merchant: Merchant;
  @Column()
  merchant_id: number;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customer_id" })
  customer?: Customer;
  @Column({ nullable: true })
  customer_id?: number;

  @ManyToOne(() => Delivery, { nullable: true })
  @JoinColumn({ name: "delivery_id" })
  delivery?: Delivery;
  @Column({ nullable: true })
  delivery_id?: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;
}