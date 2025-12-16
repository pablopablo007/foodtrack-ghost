import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
    ) { }

    private generateOrderCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async findAll(): Promise<Order[]> {
        return this.ordersRepository.find({ relations: ['user'] });
    }

    async findOne(id: string): Promise<Order | null> {
        return this.ordersRepository.findOne({ where: { id }, relations: ['user'] });
    }

    async create(orderData: Partial<Order>): Promise<Order> {
        // Generate unique 6-character code
        let code = this.generateOrderCode();
        let exists = await this.ordersRepository.findOne({ where: { id: code } });

        while (exists) {
            code = this.generateOrderCode();
            exists = await this.ordersRepository.findOne({ where: { id: code } });
        }

        const order = this.ordersRepository.create({
            ...orderData,
            id: code, // Use the 6-character code as ID
        });
        return this.ordersRepository.save(order);
    }

    async updateStatus(id: string, status: string): Promise<Order | null> {
        await this.ordersRepository.update(id, { status });
        return this.findOne(id);
    }
}
