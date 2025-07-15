import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable} from "typeorm";
import {DeliveryAgent} from "../../delivery-agents/entities/delivery-agents.entity";


@Entity()
export class Trip {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    start_city: string;

    @Column()
    end_city: string;

    @Column({type : "timestamptz"})
    date: Date;

    @ManyToOne(() => DeliveryAgent, (agent) => agent.trips, { eager: true })
    @JoinTable({ name: "delivery_agent_id" })
    delivery_agent: DeliveryAgent;

}