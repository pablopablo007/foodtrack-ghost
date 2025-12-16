import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Post()
    async create(@Body() userData: Partial<User>): Promise<User> {
        return this.usersService.create(userData);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.usersService.delete(id);
    }
}
