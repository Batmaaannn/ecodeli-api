import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Status } from "src/types/status";
import { FileTargetType, DocumentType } from "src/types/file";

@Entity({ name: "files" })
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
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column()
  file_url: string;

  @Column()
  file_name: string;

  @Column({ nullable: true })
  validity: Date;

  @Column({ nullable: true })
  info: string;

  @Column({ type: "enum", enum: DocumentType, nullable: true })
  document_type: DocumentType;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
