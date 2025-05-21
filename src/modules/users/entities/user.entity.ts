import { UserType } from "src/types/user";
import {
  Column,
  CreateDateColumn,
  Entity,
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
  @RelationId((user: User) => user.delivery_agent)
  service_agent_id?: number;

  @OneToOne(() => Merchant, (merchants) => merchants.user, {
    nullable: true,
  })
  merchants?: Merchant;
  @RelationId((user: User) => user.merchants)
  merchants_id?: number;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}
