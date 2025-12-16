import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);

        if (user && user.password === password) {
            return user;
        }

        return null;
    }
}
