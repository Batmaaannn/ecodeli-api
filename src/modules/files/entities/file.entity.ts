import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Statut } from "src/types/statut";
import { FileTargetType } from "src/types/file";

@Entity({ name: "file" })
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: FileTargetType })
  target_type: FileTargetType;

  @Column()
  target_id: number;

  @Column({ nullable: true })
  approval_date: Date;

  @Column({
    type: "enum",
    enum: Statut,
    default: Statut.PENDING,
  })
  status: Statut;

  @Column()
  file_url: string;

  @Column()
  file_name: string;

  @Column({ nullable: true })
  validity: Date;

  @Column({ nullable: true })
  info: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
