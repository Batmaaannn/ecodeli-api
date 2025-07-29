import { Announcement } from "src/modules/announcements/entities/annoucement.entity";
import { Appointment } from "src/modules/appointment/entities/appointment.entity";
import { Rating } from "src/modules/ratings/entities/rating.entity";
import { StorageBox } from "src/modules/storages/entities/storage-box.entity";
import { User } from "src/modules/users/entities/user.entity";
import { SubscriptionPlan } from "src/types/subscription-plan";
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

@Entity({ name: "customers" })
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  last_name: string;

  @Column()
  first_name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  address_1?: string;

  @Column({ nullable: true })
  address_2?: string;

  @Column({ nullable: true })
  postal_code?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({
    type: "enum",
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  wallet_balance: number;

  @Column({ nullable: true })
  subscription_start: Date;

  @Column({ default: false })
  tutorial_completed: boolean;

  @OneToOne(() => User, (user) => user.customer, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User;
  @Column({ nullable: true })
  user_id?: number;

  @OneToMany(() => Appointment, (appointment) => appointment.customer, {
    nullable: true,
  })
  appointments: Appointment[];

  @OneToMany(() => Rating, (rating) => rating.rater)
  ratingsGiven: Rating[];

  @OneToMany(() => Rating, (rating) => rating.rated)
  ratingsReceived: Rating[];

  @OneToMany(() => Announcement, (announcement) => announcement.customer)
  announcements: Announcement[];

  @OneToMany(() => StorageBox, (storageBox) => storageBox.customer)
  storageBoxes: StorageBox[];

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
