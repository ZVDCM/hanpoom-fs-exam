import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from '@repo/types';
import { UserRepository } from 'src/auth/repositories/user.repository';
import { BlacklistedAccessTokenRepository } from 'src/auth/repositories/blacklisted-access-token.repository';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
        private readonly blacklistedAccessTokenRepository: BlacklistedAccessTokenRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        const accessToken = request.headers['authorization']?.replace('Bearer ', '');
        if (!accessToken) throw new UnauthorizedException();

        const blacklistedAccessToken =
            await this.blacklistedAccessTokenRepository.findToken(accessToken);

        if (blacklistedAccessToken) {
            throw new UnauthorizedException();
        }

        return await this.userRepository.find(payload.email);
    }
}
