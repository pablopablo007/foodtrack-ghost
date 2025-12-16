import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    async findAll(): Promise<Order[]> {
        return this.ordersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Order | null> {
        return this.ordersService.findOne(id);
    }

    @Post()
    async create(@Body() orderData: Partial<Order>): Promise<Order> {
        return this.ordersService.create(orderData);
    }

    @Put(':id/status')
    async updateStatus(@Param('id') id: string, @Body() body: { status: string }): Promise<Order | null> {
        return this.ordersService.updateStatus(id, body.status);
    }
}
