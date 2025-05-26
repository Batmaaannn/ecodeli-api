import { User } from "src/modules/users/entities/user.entity";
import { VehiculeType } from "src/types/vehicule";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "delivery_agents" })
export class DeliveryAgent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  siret: string;

  @Column()
  company_name: string;

  @Column()
  company_address: string;

  @Column({ nullable: true })
  company_city?: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @OneToOne(() => User, (user) => user.delivery_agent, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User;
  @Column({ nullable: true })
  user_id?: number;

  @Column({ unique: true })
  driving_license: string;

  @Column({ type: "enum", enum: VehiculeType, default: VehiculeType.VAN })
  vehicle_type: VehiculeType;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
