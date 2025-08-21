import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ServiceAgentPrestation } from "./service-agent-prestation.entity";

@Entity({ name: "prestations" })
export class Prestation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  category: string;

  @Column({ type: "decimal", precision: 8, scale: 2, nullable: true })
  ecodeli_price: number;

  @Column({ default: "unit" }) // 'unit', 'hour', 'km', 'day'
  pricing_unit: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => ServiceAgentPrestation, (sap) => sap.prestation)
  serviceAgentPrestations: ServiceAgentPrestation[];

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
