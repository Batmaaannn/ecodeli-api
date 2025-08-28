import { Customer } from "src/modules/customers/entities/customer.entity";
import { Rating } from "src/modules/ratings/entities/rating.entity";
import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";
import { AppointmentStatus } from "src/types/appointment";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ServiceAgentPrestation } from "src/modules/prestations/entities/service-agent-prestation.entity";

@Entity({ name: "appointments" })
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.TO_BE_PROCESSED,
  })
  status: AppointmentStatus;

  @Column()
  date: Date;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  final_price: number;

  @Column({ type: "text", nullable: true })
  special_requests: string;

  @Column({ nullable: true })
  estimated_duration_minutes: number;

  @Column({ nullable: true })
  actual_duration_minutes: number;

  @OneToMany(() => Rating, (rating) => rating.appointment)
  ratings: Rating[];

  @JoinColumn({ name: "customer_id" })
  @ManyToOne(() => Customer, (customer) => customer.appointments, {
    onDelete: "CASCADE",
  })
  customer: Customer;
  @Column({ nullable: true })
  customer_id: number;

  @JoinColumn({ name: "service_agent_id" })
  @ManyToOne(() => ServiceAgent)
  service_agent: ServiceAgent;
  @Column()
  service_agent_id: number;

  @ManyToOne(() => ServiceAgentPrestation, (spp) => spp.appointments)
  @JoinColumn({ name: "service_agent_prestation_id" })
  serviceAgentPrestation: ServiceAgentPrestation;
  @Column()
  service_agent_prestation_id: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
