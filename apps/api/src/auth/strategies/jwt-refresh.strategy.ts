import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { TokenPayload } from '@repo/types';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.auth,
            ]),
            secretOrKey: configService.getOrThrow('REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        return await this.authService.veryifyRefreshToken(request.cookies?.auth, payload.email);
    }
}
