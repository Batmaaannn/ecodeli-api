import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Status } from "src/types/status";
import { FileTargetType, DocumentType } from "src/types/file";
import { User } from "src/modules/users/entities/user.entity";

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

  @Column({ nullable: true })
  approval_user_id: number;

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

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: true })
  user_id: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
