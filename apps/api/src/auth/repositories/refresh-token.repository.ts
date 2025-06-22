import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import * as schema from 'src/auth/schema';
import { eq } from 'drizzle-orm';
import { UserId } from '@repo/types';
import { RefreshTokenFactory } from 'src/auth/domain/refresh-token-domain/refresh-token.factory';
import { RefreshToken } from 'src/auth/domain/refresh-token-domain/refresh-token';

@Injectable()
export class RefreshTokenRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>,
    ) {}

    async findUser(userId: UserId) {
        const result = await this.database.query.refreshTokens.findFirst({
            where: eq(schema.refreshTokens.userId, userId),
        });

        if (!result) throw new NotFoundException();

        const refreshToken = RefreshTokenFactory.fromPersistence(result);

        return refreshToken;
    }
    async create(userId: UserId, token: string) {
        const newRefreshToken = await RefreshToken.create(userId, token);
        await this.database
            .insert(schema.refreshTokens)
            .values(newRefreshToken.toObject())
            .onConflictDoUpdate({
                target: schema.refreshTokens.userId,
                set: { tokenHash: newRefreshToken.tokenHash },
            });
    }
}
