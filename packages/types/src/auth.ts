import { UserId } from './user';

export type RefreshTokenId = string & { __brand: 'refresh_token_id' };
export type BlacklistedAccessTokenId = string & { __brand: 'blacklisted_access_token_id' };

export interface TokenPayload {
    userId: UserId;
    email: string;
}

export interface LoginResult {
    accessToken: string;
    refreshToken: string;
}
