import { Customer } from "src/modules/customers/entities/customer.entity";
import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";
import { AppointmentStatus } from "src/types/appointment";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

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

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

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

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
