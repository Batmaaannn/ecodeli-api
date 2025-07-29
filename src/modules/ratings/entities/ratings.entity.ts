import { Customer } from "src/modules/customers/entities/customer.entity";
import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";
import { User } from "src/modules/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
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
  rater_id: number;

  @JoinColumn({ name: "rated_id" })
  @ManyToOne(() => User, (user) => user.ratingsReceived, {
    onDelete: "CASCADE",
  })
  rated: User;
  rated_id: number;

  @ManyToOne(() => Delivery, (delivery) => delivery.ratings)
  @JoinColumn({ name: "delivery_id" })
  delivery: Delivery;
  delivery_id: number;

  @ManyToOne(() => Booking, (booking) => booking.ratings)
  @JoinColumn({ name: "booking_id" })
  booking: Booking;
  booking_id: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
