import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { RegisterHandler } from 'src/auth/commands/register/register.handler';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { AuthService } from './auth.service';
import { LoginHandler } from 'src/auth/commands/login/login.handler';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/auth/strategies/jwt-refresh.strategy';
import { RefreshTokenRepository } from 'src/auth/repositories/refresh-token.repository';
import { BlacklistedAccessTokenRepository } from 'src/auth/repositories/blacklisted-access-token.repository';
import { BlacklistAccessTokenHandler } from 'src/auth/commands/blacklist-access-token/blacklist-access-token.handler';

@Module({
    imports: [DatabaseModule, PassportModule, JwtModule],
    controllers: [AuthController],
    providers: [
        UserRepository,
        RefreshTokenRepository,
        BlacklistedAccessTokenRepository,
        BlacklistAccessTokenHandler,
        RegisterHandler,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshStrategy,
        AuthService,
        LoginHandler,
    ],
})
export class AuthModule {}
