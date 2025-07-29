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
import { Rating } from "src/modules/ratings/entities/ratings.entity";


@Entity({ name: "deliveries" })
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "customer_id" })
  customer?: Customer;

  @ManyToOne(() => DeliveryAgent, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "delivery_agent_id" })
  deliveryAgent?: DeliveryAgent;
  delivery_agent_id: number;

  @Column()
  start_city: string;

  @Column()
  arrival_city: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ type: "timestamptz" })
  start_date: Date;

  @Column({ type: "timestamptz" })
  end_date: Date;

  @Column({ default: false })
  assurance: boolean;

  @Column({ default: false })
  urgent: boolean;

  @OneToMany(() => Package, (packageEntity) => packageEntity.delivery)
  packages: Package[];

  @OneToMany(() => Rating, (rating) => rating.delivery)
  ratings: Rating[];

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;
}
