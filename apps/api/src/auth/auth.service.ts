import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenRepository } from 'src/auth/repositories/refresh-token.repository';
import { UserRepository } from 'src/auth/repositories/user.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ) {}

    async validate(email: string, password: string) {
        const user = await this.userRepository.find(email);
        if (!user) throw new UnauthorizedException();

        const matches = await user.compare(password);
        if (matches) return user;

        return null;
    }

    async veryifyRefreshToken(refreshToken: string, email: string) {
        const user = await this.userRepository.find(email);
        if (!user) throw new UnauthorizedException();

        const token = await this.refreshTokenRepository.findUser(user.id);
        if (!token) throw new UnauthorizedException();

        const matches = await token.compare(refreshToken);
        if (matches) return user;

        return null;
    }
}
