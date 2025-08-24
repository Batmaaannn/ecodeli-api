import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryAgent } from './delivery-agents.entity';

@Entity({ name: 'delivery_agents_schedule' })
export class DeliveryAgentsSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: number;

  @Column({ default: true })
  full_day: boolean;

  @ManyToOne(() => DeliveryAgent, (deliveryAgent) => deliveryAgent.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'delivery_agent_id' })
  delivery_agent: DeliveryAgent;
  @Column({ nullable: true })
  delivery_agent_id: number;

  @Column({ type: 'time', nullable: true, default: '08:30' })
  morning_start: string;

  @Column({ type: 'time', nullable: true, default: '13:00' })
  morning_end: string;

  @Column({ type: 'time', nullable: true, default: '13:00' })
  afternoon_start: string;

  @Column({ type: 'time', nullable: true, default: '17:30' })
  afternoon_end: string;
}
