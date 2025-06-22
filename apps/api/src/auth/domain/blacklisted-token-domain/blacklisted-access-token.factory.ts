import { BlacklistedAccessTokenId, UserId } from '@repo/types';
import { BlacklistedAccessToken } from 'src/auth/domain/blacklisted-token-domain/blacklisted-access-token';

export class BlacklistedAccessTokenFactory {
    static fromPersistence(raw: {
        id: BlacklistedAccessTokenId;
        userId: UserId;
        tokenHash: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }): BlacklistedAccessToken {
        return new BlacklistedAccessToken(
            raw.id,
            raw.userId,
            raw.tokenHash,
            raw.createdAt || undefined,
            raw.updatedAt || undefined,
        );
    }
}
