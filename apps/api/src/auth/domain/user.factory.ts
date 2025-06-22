import { UserId } from '@repo/types';
import { User } from 'src/auth/domain/user';

export class UserFactory {
    static fromPersistence(raw: {
        id: UserId;
        email: string;
        passwordHash: string;
        createdAt: Date | null;
        updatedAt: Date | null;
    }): User {
        return new User(
            raw.id,
            raw.email,
            raw.passwordHash,
            raw.createdAt || undefined,
            raw.updatedAt || undefined,
        );
    }
}
