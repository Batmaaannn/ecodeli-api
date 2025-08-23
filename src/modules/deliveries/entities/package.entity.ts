import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Delivery } from "./delivery.entity";
import { StorageBox } from "src/modules/storages/entities/storage-box.entity";

@Entity({ name: "packages" })
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 8, scale: 3 })
  weight: number; //kg

  @Column({ nullable: true })
  length: number; //cm

  @Column({ nullable: true })
  width: number; //cm

  @Column({ nullable: true })
  height: number; //cm

  @Column()
  quantity: number;

  @Column({ nullable: true })
  photos: string;

  @Column({ nullable: true })
  fragile: boolean;

  @ManyToOne(() => Delivery, (delivery) => delivery.packages)
  @JoinColumn({ name: "delivery_id" })
  delivery: Delivery;
  @Column({ nullable: true })
  delivery_id: number;

  @ManyToOne(() => StorageBox, (storageBox) => storageBox.packages)
  @JoinColumn({ name: "storage_box_id" })
  storageBox: StorageBox;
  @Column({ nullable: true })
  storage_box_id: number;
}
