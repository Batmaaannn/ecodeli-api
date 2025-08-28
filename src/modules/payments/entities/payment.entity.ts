import { User } from "src/modules/users/entities/user.entity";
import { PaymentStatus, PaymentType } from "src/types/payment";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";


@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: "enum",
    enum: PaymentType,
  })
  payment_type: PaymentType;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  stripe_payment_id: string;

  @CreateDateColumn()
  transaction_date: Date;

  @Column({ nullable: true })
  related_id: number; // delivery_id or booking_id

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: "user_id" })
  user: User;
  @Column()
  user_id: number;
}
