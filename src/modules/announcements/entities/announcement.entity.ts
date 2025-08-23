import { Customer } from "src/modules/customers/entities/customer.entity";
import { Delivery } from "src/modules/deliveries/entities/delivery.entity";
import { AnnouncementStatus, AnnouncementType } from "src/types/announcement";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("announcements")
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column()
  departure_city: string;

  @Column()
  arrival_city: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  price: number;

  @Column()
  pickup_date: Date;

  @Column()
  delivery_date: Date;

  @Column({ default: false })
  assurance: boolean;

  @Column({ default: false })
  urgent: boolean;

  @Column({ nullable: true })
  pickup_instructions: string;

  @Column({
    type: "enum",
    enum: AnnouncementStatus,
    default: AnnouncementStatus.POSTED,
  })
  status: AnnouncementStatus;

  @Column({
    type: "enum",
    enum: AnnouncementType,
    default: AnnouncementType.PACKAGE,
  })
  announcement_type: AnnouncementType;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  // Relations
  @ManyToOne(() => Customer, (customer) => customer.announcements)
  @JoinColumn({ name: "customer_id" })
  customer: Customer;
  @Column()
  customer_id: number;

  @OneToMany(() => Delivery, (delivery) => delivery.announcement)
  deliveries: Delivery[];
}
