import { AggregateRoot } from '@nestjs/cqrs';
import { BlacklistedAccessTokenId } from '@repo/types';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { hashToken } from 'src/utils/hash-token';

export class BlacklistedAccessToken extends AggregateRoot {
    constructor(
        private readonly _id: BlacklistedAccessTokenId,
        private readonly _tokenHash: string,
        private readonly _createdAt?: Date,
        private readonly _updatedAt?: Date,
    ) {
        super();
    }

    get id() {
        return this._id;
    }
    get tokenHash() {
        return this._tokenHash;
    }
    get created_at() {
        return this._createdAt;
    }
    get updated_at() {
        return this._updatedAt;
    }

    static async create(token: string) {
        const tokenHash = hashToken(token);
        return new BlacklistedAccessToken(randomUUID() as BlacklistedAccessTokenId, tokenHash);
    }

    async compare(token: string) {
        const tokenHash = hashToken(token);
        return await bcrypt.compare(tokenHash, this._tokenHash);
    }

    toObject() {
        return {
            id: this._id,
            tokenHash: this._tokenHash,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
