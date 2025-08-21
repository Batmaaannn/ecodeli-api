import { DeliveryAgent } from "src/modules/delivery-agents/entities/delivery-agents.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("routes")
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deliverer_id: number;

  @Column()
  departure_city: string;

  @Column()
  arrival_city: string;

  @Column()
  departure_date: Date;

  @Column()
  arrival_date: Date;

  @Column({ default: true })
  is_available: boolean;

  @Column({ default: 1 })
  max_packages: number;

  // Relations
  @ManyToOne(() => DeliveryAgent, (delivery_agent) => delivery_agent.routes)
  @JoinColumn({ name: "delivery_agent_id" })
  delivery_agent: DeliveryAgent;
  delivery_agent_id: number;
}
