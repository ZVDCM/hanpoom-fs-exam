import { Command } from '@nestjs/cqrs';

export class BlacklistAccessTokenCommand extends Command<void> {
    constructor(public readonly token: string) {
        super();
    }
}
