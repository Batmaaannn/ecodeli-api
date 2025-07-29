import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Prestation } from "./prestations.entity";
import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";
import { Status } from "src/types/status";
import { PrestationStatus } from "src/types/prestation";
import { Appointment } from "src/modules/appointment/entities/appointment.entity";

@Entity({ name: "service_agent_prestations" })
export class ServiceAgentPrestation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  requested_price: number;

  @Column({ type: "decimal", precision: 8, scale: 2, nullable: true })
  applied_price: number;

  // 📋 Statut de validation du prix par EcoDeli
  @Column({
    type: "enum",
    enum: PrestationStatus,
    default: PrestationStatus.PENDING,
  })
  price_status: PrestationStatus;

  @Column({ type: "text", nullable: true })
  ecodeli_comment: string;

  @Column({ default: true })
  is_available: boolean;

  @Column({ nullable: true })
  validated_at: Date;

  @Column({ nullable: true })
  validated_by: number;

  @ManyToOne(
    () => ServiceAgent,
    (service_agent) => service_agent.serviceAgentPrestations
  )
  @JoinColumn({ name: "service_agent_id" })
  service_agent: ServiceAgent;
  service_agent_id: number;

  @ManyToOne(
    () => Prestation,
    (prestation) => prestation.serviceAgentPrestations
  )
  @JoinColumn({ name: "prestation_id" })
  prestation: Prestation;
  prestation_id: number;

  @OneToMany(() => Appointment, (appointment) => appointment.service_agent)
  appointments: Appointment[];

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
