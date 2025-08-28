import { Delivery } from "src/modules/deliveries/entities/delivery.entity";
import { Route } from "src/modules/deliveries/entities/route.entity";
import { User } from "src/modules/users/entities/user.entity";
import { VehiculeType } from "src/types/vehicule";
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
import { DeliveryAgentsSchedule } from "./delivery-agents-schedule.entity";

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

  @Column()
  company_city: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone_number: string;

  @Column({ type: "enum", enum: VehiculeType, default: VehiculeType.VAN })
  vehicle_type: VehiculeType;

  @Column()
  license_number: string;

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ unique: true, nullable: true })
  nfc_card_id: string;

  @Column({ default: false })
  has_completed_profile: boolean;

  @Column({ nullable: true })
  favorite_delivery_city: string;

  @Column({ nullable: true })
  max_radius_km: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  // Relations

  @OneToMany(() => Delivery, (delivery) => delivery.delivery_agent)
  deliveries: Delivery[];

  @OneToOne(() => User, (user) => user.delivery_agent, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User;
  @Column({ nullable: true })
  user_id?: number;

  @OneToMany(() => Route, (route) => route.delivery_agent)
  routes: Route[];

  @OneToMany(() => DeliveryAgentsSchedule, (schedule) => schedule.delivery_agent)
  schedules: DeliveryAgentsSchedule[];
}
