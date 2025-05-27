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
  rating: string;

  @Column()
  comment: string;

  @Column()
  date: Date;

  @ManyToOne(() => Customer, (customer) => customer.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @ManyToOne(() => ServiceAgent, (agent) => agent.reviews, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "service_agent_id" })
  serviceAgent: ServiceAgent;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
