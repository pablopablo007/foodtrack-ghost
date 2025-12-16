import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'varchar', length: 50 })
    category: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    image: string;

    @Column({ type: 'boolean', default: true })
    available: boolean;
}
