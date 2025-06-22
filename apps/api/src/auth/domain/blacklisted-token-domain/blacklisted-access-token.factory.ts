import { BlacklistedAccessTokenId } from '@repo/types';
import { BlacklistedAccessToken } from 'src/auth/domain/blacklisted-token-domain/blacklisted-access-token';

export class BlacklistedAccessTokenFactory {
    static fromPersistence(raw: {
        id: BlacklistedAccessTokenId;
        tokenHash: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }): BlacklistedAccessToken {
        return new BlacklistedAccessToken(
            raw.id,
            raw.tokenHash,
            raw.createdAt || undefined,
            raw.updatedAt || undefined,
        );
    }
}
