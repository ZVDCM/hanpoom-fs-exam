import { AggregateRoot } from '@nestjs/cqrs';
import { UserId } from '@repo/types';

export class User extends AggregateRoot {
    constructor(
        private readonly id: UserId,
        private readonly email: string,
        private readonly passwordHash: string,
        private readonly created_at: Date,
        private readonly updated_at: Date,
    ) {
        super();
    }
}
