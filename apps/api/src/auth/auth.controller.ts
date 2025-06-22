import { Body, Controller, Get, Headers, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import type { Response } from 'express';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { BlacklistAccessTokenCommand } from 'src/auth/commands/blacklist-access-token/blacklist-access-token.command';
import { LoginCommand } from 'src/auth/commands/login/login.command';
import { RegisterCommand } from 'src/auth/commands/register/register.command';
import { User } from 'src/auth/domain/user-domain/user';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JwtRefreshAuthGuard } from 'src/auth/guard/jwt-refresh-auth.guard';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly commandBus: CommandBus,
    ) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@AuthUser() user: User) {
        return user.toResponse();
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@AuthUser() user: User, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.commandBus.execute(new LoginCommand(user));

        res.cookie('auth', refreshToken, {
            httpOnly: true,
            path: '/auth/refresh',
            sameSite: 'strict',
            secure: this.configService.get('NODE_ENV') === 'production',
            expires: new Date(Date.now() + this.configService.get('REFRESH_TOKEN_EXPIRATION_MS')),
        });

        res.status(200).send({
            user: user.toResponse(),
            accessToken,
        });
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        await this.commandBus.execute(
            new RegisterCommand(createUserDto.email, createUserDto.password),
        );
    }

    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    async refresh(
        @AuthUser() user: User,
        @Headers('authorization') authHeader: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const oldAccessToken = authHeader?.replace('Bearer ', '');

        const { accessToken, refreshToken } = await this.commandBus.execute(new LoginCommand(user));
        await this.commandBus.execute(new BlacklistAccessTokenCommand(user, oldAccessToken));

        res.cookie('auth', refreshToken, {
            httpOnly: true,
            path: '/auth/refresh',
            sameSite: 'strict',
            secure: this.configService.get('NODE_ENV') === 'production',
            expires: new Date(Date.now() + this.configService.get('REFRESH_TOKEN_EXPIRATION_MS')),
        });

        return { accessToken };
    }

    @Post('logout')
    logout(@Res() res: Response) {
        res.clearCookie('auth', { path: '/auth/refresh' });
        res.status(200).json();
    }
}
