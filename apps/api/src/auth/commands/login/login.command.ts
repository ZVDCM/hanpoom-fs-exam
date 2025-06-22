import { Command } from '@nestjs/cqrs';
import { LoginResult } from '@repo/types';
import { User } from 'src/auth/domain/user-domain/user';

export class LoginCommand extends Command<LoginResult> {
    constructor(public readonly user: User) {
        super();
    }
}
