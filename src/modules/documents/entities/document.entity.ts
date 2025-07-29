import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { DocumentType } from "src/types/file";
import { User } from "src/modules/users/entities/user.entity";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({
    type: "enum",
    enum: DocumentType,
  })
  document_type: DocumentType;

  @Column()
  file_path: string;

  @CreateDateColumn()
  generated_at: Date;

  @Column({ default: false })
  is_archived: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: "user_id" })
  user: User;
}
