import { AggregateRoot } from '@nestjs/cqrs';
import { UserId } from '@repo/types';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

export class User extends AggregateRoot {
    constructor(
        private readonly _id: UserId,
        private readonly _email: string,
        private readonly _passwordHash: string,
        private readonly _createdAt?: Date,
        private readonly _updatedAt?: Date,
    ) {
        super();
    }

    get id() {
        return this._id;
    }
    get email() {
        return this._email;
    }
    get createdAt() {
        return this._createdAt;
    }
    get updatedAt() {
        return this._updatedAt;
    }

    static async create(email: string, password: string) {
        const passwordHash = await bcrypt.hash(password, 10);
        return new User(randomUUID() as UserId, email, passwordHash);
    }

    async compare(password: string) {
        return await bcrypt.compare(password, this._passwordHash);
    }

    toObject() {
        return {
            id: this._id,
            email: this.email,
            passwordHash: this._passwordHash,
            created_at: this._createdAt,
            updated_at: this._updatedAt,
        };
    }

    toResponse() {
        return {
            id: this._id,
            email: this.email,
            createdAt: this._createdAt,
        };
    }
}
