import { Command } from '@nestjs/cqrs';
import { User } from 'src/auth/domain/user-domain/user';

export class BlacklistAccessTokenCommand extends Command<void> {
    constructor(
        public readonly user: User,
        public readonly token: string,
    ) {
        super();
    }
}
