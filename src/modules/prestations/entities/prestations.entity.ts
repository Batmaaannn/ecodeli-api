import { RegistrationRequest } from "src/modules/registration-requests/entities/registration-requests.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "prestations" })
export class Prestation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  category: string;

  @ManyToOne(
    () => RegistrationRequest,
    (registrationRequest) => registrationRequest.prestations,
    { nullable: true }
  )
  registrationRequest?: RegistrationRequest;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
