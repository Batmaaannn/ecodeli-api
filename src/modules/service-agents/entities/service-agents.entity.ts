import { User } from "src/modules/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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

  @Column({ nullable: true })
  company_city?: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  address?: string;

  @OneToOne(() => User, (user) => user.service_agent, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User;
  @Column({ nullable: true })
  user_id?: number;

  //ManyToOne Prestations

  //OneToMany
  //   @Column({ nullable: true })
  //   rating?: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
