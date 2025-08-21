import { Appointment } from "src/modules/appointment/entities/appointment.entity";
import { ServiceAgentPrestation } from "src/modules/prestations/entities/service-agent-prestation.entity";
import { User } from "src/modules/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "service_agents" })
export class ServiceAgent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  siret: string;

  @Column()
  company_name: string;

  @Column()
  company_address: string;

  @Column()
  company_city: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  certifications: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  monthly_earnings: number;

  @Column({ nullable: true })
  last_invoice_date: Date;

  @OneToOne(() => User, (user) => user.service_agent, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User;
  @Column({ nullable: true })
  user_id?: number;

  @OneToMany(() => Appointment, (appointment) => appointment.service_agent)
  appointments: Appointment[];

  @OneToMany(() => ServiceAgentPrestation, (sap) => sap.service_agent)
  serviceAgentPrestations: ServiceAgentPrestation[];

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
