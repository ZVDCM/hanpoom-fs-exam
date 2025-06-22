import { AggregateRoot } from '@nestjs/cqrs';
import { UserId } from '@repo/types';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';

export class User extends AggregateRoot {
    constructor(
        private readonly _id: UserId,
        private readonly _email: string,
        private readonly _passwordHash: string,
        private readonly _created_at?: Date,
        private readonly _updated_at?: Date,
    ) {
        super();
    }
    get id() {
        return this._id;
    }
    get email() {
        return this._email;
    }
    get created_at() {
        return this._created_at;
    }
    get updated_at() {
        return this._updated_at;
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
            created_at: this._created_at,
            updated_at: this._updated_at,
        };
    }
}
