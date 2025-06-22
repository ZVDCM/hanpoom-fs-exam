import { AggregateRoot } from '@nestjs/cqrs';
import { RefreshTokenId, UserId } from '@repo/types';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

export class RefreshToken extends AggregateRoot {
    constructor(
        private readonly _id: RefreshTokenId,
        private readonly _userId: UserId,
        private readonly _tokenHash: string,
        private readonly _createdAt?: Date,
        private readonly _updatedAt?: Date,
    ) {
        super();
    }

    get id() {
        return this._id;
    }
    get userId() {
        return this._userId;
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

    static async create(userId: UserId, token: string) {
        const tokenHash = await bcrypt.hash(token, 10);
        return new RefreshToken(randomUUID() as RefreshTokenId, userId, tokenHash);
    }

    async compare(token: string) {
        return await bcrypt.compare(token, this._tokenHash);
    }

    toObject() {
        return {
            id: this._id,
            userId: this.userId,
            tokenHash: this._tokenHash,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
