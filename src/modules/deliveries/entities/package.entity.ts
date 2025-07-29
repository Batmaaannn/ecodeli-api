import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Delivery } from "./delivery.entity";

@Entity({ name: "packages" })
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  photo?: string;

  @Column()
  quantity: number;

  @Column()
  label: string;

  @Column("decimal", { precision: 10, scale: 2 })
  poids: number;

  @Column({ name: "additional_info", nullable: true })
  additional_info?: string;

  @ManyToOne(() => Delivery, (delivery) => delivery.packages, {
    onDelete: "CASCADE",
  })
  delivery: Delivery;
}
