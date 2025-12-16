import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() credentials: { username: string; password: string }) {
        const user = await this.authService.validateUser(credentials.username, credentials.password);

        if (!user) {
            throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
        }

        return {
            success: true,
            message: 'Login exitoso',
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role,
            },
        };
    }
}
