import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {DeliveryAgent} from "../../delivery-agents/entities/delivery-agents.entity";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { DeliveryObject} from "./delivery-request-object.entity";

@Entity({ name: "delivery_requests" })
export class DeliveryRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer;

    @ManyToOne(() => DeliveryAgent, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "delivery_agent_id" })
    deliveryAgent?: DeliveryAgent;

    @Column()
    start_city: string;

    @Column()
    arrival_city: string;

    @Column("decimal", {precision: 5, scale: 2})
    price: number;

    @Column({type: "timestamptz"})
    start_date: Date;

    @Column({type: "timestamptz"})
    end_date: Date;

    @Column({default:false})
    assurance: boolean;

    @Column({default: false})
    urgent: boolean;

    @OneToMany(() => DeliveryObject, (object) => object.deliveryRequest, { cascade: true,})
    objects: DeliveryObject[];

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

}
