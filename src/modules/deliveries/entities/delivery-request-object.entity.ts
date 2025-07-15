import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from "typeorm";
import { DeliveryRequest } from "./delivery-request.entity";

@Entity({ name: "delivery_object" })
export class DeliveryObject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    photo?: string;

    @Column()
    quantity: number;

    @Column()
    label: string;

    @Column("decimal", { precision: 10, scale: 2 })
    poids: number;

    @Column({ name: "additional_info", nullable: true })
    additional_info?: string;

    @ManyToOne(() => DeliveryRequest, (request) => request.objects, { onDelete: "CASCADE" })
    deliveryRequest: DeliveryRequest;

}