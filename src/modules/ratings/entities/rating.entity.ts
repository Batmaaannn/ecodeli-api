import { Appointment } from "src/modules/appointment/entities/appointment.entity";
import { Delivery } from "src/modules/deliveries/entities/delivery.entity";
import { User } from "src/modules/users/entities/user.entity";
import { RatingType } from "src/types/rating";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "ratings" })
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @Column()
  date: Date;

  @Column({
    type: "enum",
    enum: RatingType,
  })
  rating_type: RatingType;

  @JoinColumn({ name: "rater_id" })
  @ManyToOne(() => User, (user) => user.ratingsGiven, {
    onDelete: "CASCADE",
  })
  rater: User;
  @Column()
  rater_id: number;

  @JoinColumn({ name: "rated_id" })
  @ManyToOne(() => User, (user) => user.ratingsReceived, {
    onDelete: "CASCADE",
  })
  rated: User;
  @Column()
  rated_id: number;

  @ManyToOne(() => Delivery, (delivery) => delivery.ratings)
  @JoinColumn({ name: "delivery_id" })
  delivery: Delivery;
  @Column()
  delivery_id: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.ratings)
  @JoinColumn({ name: "appointment_id" })
  appointment: Appointment;
  @Column()
  appointment_id: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
