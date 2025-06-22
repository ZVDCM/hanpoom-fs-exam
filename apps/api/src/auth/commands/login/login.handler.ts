import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { LoginResult, TokenPayload } from '@repo/types';
import { LoginCommand } from 'src/auth/commands/login/login.command';
import { RefreshTokenRepository } from 'src/auth/repositories/refresh-token.repository';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) {}

    async execute({ user }: LoginCommand): Promise<LoginResult> {
        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email,
        };

        const accessToken = this.jwtService.sign(tokenPayload, {
            secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow('ACCESS_TOKEN_EXPIRATION_MS')}ms`,
        });

        const refreshToken = this.jwtService.sign(tokenPayload, {
            secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow('REFRESH_TOKEN_EXPIRATION_MS')}ms`,
        });

        await this.refreshTokenRepository.create(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }
}
