import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('orders')
export class Order {
    @PrimaryColumn({ type: 'varchar', length: 6 })
    id: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    customerName: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'jsonb' })
    items: any; // Store cart items as JSON

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'varchar', length: 20, default: 'PREPARING' })
    status: string; // 'PREPARING', 'READY', 'COMPLETED'

    @CreateDateColumn()
    createdAt: Date;
}
