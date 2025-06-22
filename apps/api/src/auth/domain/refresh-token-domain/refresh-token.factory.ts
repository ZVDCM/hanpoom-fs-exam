import { RefreshTokenId, UserId } from '@repo/types';
import { RefreshToken } from 'src/auth/domain/refresh-token-domain/refresh-token';

export class RefreshTokenFactory {
    static fromPersistence(raw: {
        id: RefreshTokenId;
        userId: UserId;
        tokenHash: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }): RefreshToken {
        return new RefreshToken(
            raw.id,
            raw.userId,
            raw.tokenHash,
            raw.createdAt || undefined,
            raw.updatedAt || undefined,
        );
    }
}
