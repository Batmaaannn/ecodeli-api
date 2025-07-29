import { User } from "src/modules/users/entities/user.entity";
import { NotificationType } from "src/types/notification";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  notification_type: NotificationType;

  @Column({ default: false })
  is_read: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: "user_id" })
  user: User;
  user_id: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
