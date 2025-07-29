import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Appointment } from "./appointment.entity";

@Entity("services")
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service_name: string;

  @Column({ type: "int" })
  service_category: number;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  base_price: number;

  @Column()
  duration_minutes: number;

  // Relations
  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];
}
