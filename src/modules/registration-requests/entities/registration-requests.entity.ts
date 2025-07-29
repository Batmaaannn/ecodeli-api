// import { Prestation } from "src/modules/prestations/entities/prestations.entity";
// import { AgentType } from "src/types/user";
// import { VehiculeType } from "src/types/vehicule";
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm";
// import { PrestationRegistrationRequest } from "./prestation-registration-request.entity";
// import { Status } from "src/types/status";

// @Entity({ name: "registration-requests" })
// export class RegistrationRequest {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   siret: string;

//   @Column({ nullable: true, unique: true })
//   token_request: string;

//   @Column({ unique: true })
//   email: string;

//   @Column()
//   company_name: string;

//   @Column()
//   company_address: string;

//   @Column()
//   company_city: string;

//   @Column()
//   first_name: string;

//   @Column()
//   last_name: string;

//   @Column()
//   phone_number: string;

//   @Column({
//     type: "enum",
//     enum: AgentType,
//     default: AgentType.DELIVERY_AGENT,
//   })
//   agent_type: AgentType;

//   @OneToMany(
//     () => PrestationRegistrationRequest,
//     (link) => link.registrationRequest,
//     { cascade: true }
//   )
//   prestationLinks?: PrestationRegistrationRequest[];

//   @Column({
//     type: "enum",
//     enum: VehiculeType,
//     nullable: true,
//   })
//   vehicle_type?: VehiculeType;

//   @Column({
//     type: "enum",
//     enum: Status,
//     default: Status.PENDING,
//   })
//   status: Status;

//   @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
//   created_at: Date;

//   @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
//   updated_at: Date;
// }
