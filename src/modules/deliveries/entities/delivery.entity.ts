import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DeliveryAgent } from "../../delivery-agents/entities/delivery-agents.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Rating } from "src/modules/ratings/entities/rating.entity";
import { Package } from "./package.entity";
import { DeliveryStatus, DeliveryType } from "src/types/delivery";
import { Announcement } from "src/modules/announcements/entities/annoucement.entity";

@Entity({ name: "deliveries" })
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: DeliveryType,
    default: DeliveryType.FULL,
  })
  delivery_type: DeliveryType;

  @Column({ unique: true })
  tracking_code: string;

  @Column({
    type: "enum",
    enum: DeliveryStatus,
    default: DeliveryStatus.ASSIGNED,
  })
  status: DeliveryStatus;

  @Column({ nullable: true })
  pickup_time: Date;

  @Column({ nullable: true })
  delivery_time: Date;

  @Column({ nullable: true })
  delivery_code: string;

  @OneToMany(() => Package, (packageEntity) => packageEntity.delivery)
  packages: Package[];

  @OneToMany(() => Rating, (rating) => rating.delivery)
  ratings: Rating[];

  @ManyToOne(() => DeliveryAgent, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "delivery_agent_id" })
  delivery_agent?: DeliveryAgent;
  delivery_agent_id: number;

  @ManyToOne(() => Announcement, (announcement) => announcement.deliveries)
  @JoinColumn({ name: "announcement_id" })
  announcement: Announcement;
  announcement_id: number;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
