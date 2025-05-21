import { AgentType } from "src/types/user";
import { VehiculeType } from "src/types/vehicule";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "registration-requests" })
export class RegistrationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  siret: string;

  @Column({ nullable: true, unique: true })
  token_request: string;

  @Column({ unique: true })
  email: string;

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

  @Column({
    type: "enum",
    enum: AgentType,
    default: AgentType.DELIVERY_AGENT,
  })
  agent_type: AgentType;

  @Column("text", { array: true, nullable: true })
  prestations?: string[];

  @Column({ nullable: true, unique: true })
  driving_license?: string;

  @Column({
    type: "enum",
    enum: VehiculeType,
    default: VehiculeType.VAN,
    nullable: true,
  })
  vehicle_type?: VehiculeType;

  @Column({ default: false })
  is_processed: boolean;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
