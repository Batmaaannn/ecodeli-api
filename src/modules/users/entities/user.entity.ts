import { UserType } from "src/types/user";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { DeliveryAgent } from "src/modules/delivery-agents/entities/delivery-agents.entity";
import { ServiceAgent } from "src/modules/service-agents/entities/service-agents.entity";
import { Merchant } from "src/modules/merchants/entities/merchants.entity";
import { Rating } from "src/modules/ratings/entities/rating.entity";
import { Payment } from "src/modules/payments/entities/payment.entity";
import { Notification } from "src/modules/notifications/entities/notification.entity";
import { File } from "src/modules/files/entities/file.entity";
import { Status } from "src/types/status";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: "enum", enum: UserType, default: UserType.CUSTOMER })
  user_type: UserType;

  @Column({ default: false })
  is_validated: boolean;

  @Column({ default: true })
  is_active: boolean;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @OneToOne(() => Customer, (customer) => customer.user, {
    nullable: true,
  })
  customer?: Customer;
  @RelationId((user: User) => user.customer)
  customer_id?: number;

  @OneToOne(() => DeliveryAgent, (delivery_agent) => delivery_agent.user, {
    nullable: true,
  })
  delivery_agent?: DeliveryAgent;
  @RelationId((user: User) => user.delivery_agent)
  delivery_agent_id?: number;

  @OneToOne(() => ServiceAgent, (service_agent) => service_agent.user, {
    nullable: true,
  })
  service_agent?: ServiceAgent;
  @RelationId((user: User) => user.service_agent)
  service_agent_id?: number;

  @OneToOne(() => Merchant, (merchant) => merchant.user, {
    nullable: true,
  })
  merchant?: Merchant;
  @RelationId((user: User) => user.merchant)
  merchant_id?: number;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => File, (file) => file.user)
  files: File[];

  @OneToMany(() => Rating, (rating) => rating.rater)
  ratingsGiven: Rating[];

  @OneToMany(() => Rating, (rating) => rating.rated)
  ratingsReceived: Rating[];

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
