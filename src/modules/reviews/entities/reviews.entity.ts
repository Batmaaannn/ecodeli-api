import { Customer } from "src/modules/customers/entities/customer.entity";
import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "reviews" })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @Column()
  date: Date;

  @JoinColumn({ name: "customer_id" })
  @ManyToOne(() => Customer, (customer) => customer.reviews, {
    onDelete: "CASCADE",
  })
  customer: Customer;
  customer_id: number;

  @JoinColumn({ name: "service_agent_id" })
  @ManyToOne(() => ServiceAgent, (agent) => agent.reviews, {
    onDelete: "CASCADE",
  })
  serviceAgent: ServiceAgent;
  @Column()
  service_agent_id: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
