import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import * as schema from 'src/auth/schema';
import { eq } from 'drizzle-orm';
import { BlacklistedAccessTokenFactory } from 'src/auth/domain/blacklisted-token-domain/blacklisted-access-token.factory';
import { BlacklistedAccessToken } from 'src/auth/domain/blacklisted-token-domain/blacklisted-access-token';
import { hashToken } from 'src/utils/hash-token';

@Injectable()
export class BlacklistedAccessTokenRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>,
    ) {}

    async findToken(token: string) {
        const tokenHash = hashToken(token);
        const result = await this.database.query.blacklistedAccessTokens.findFirst({
            where: eq(schema.blacklistedAccessTokens.tokenHash, tokenHash),
        });

        if (!result) return null;

        const blacklistedAccessToken = BlacklistedAccessTokenFactory.fromPersistence(result);

        return blacklistedAccessToken;
    }
    async create(token: string) {
        const newBlacklistedAccessToken = await BlacklistedAccessToken.create(token);
        await this.database
            .insert(schema.blacklistedAccessTokens)
            .values(newBlacklistedAccessToken.toObject())
            .onConflictDoNothing();
    }
}
