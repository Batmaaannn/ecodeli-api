import { PrestationRegistrationRequest } from "src/modules/registration-requests/entities/prestation-registration-request.entity";
import { RegistrationRequest } from "src/modules/registration-requests/entities/registration-requests.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => PrestationRegistrationRequest, (link) => link.prestation)
  registrationRequestLinks: PrestationRegistrationRequest[];

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
