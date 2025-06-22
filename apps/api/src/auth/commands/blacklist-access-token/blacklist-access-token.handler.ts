import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlacklistAccessTokenCommand } from 'src/auth/commands/blacklist-access-token/blacklist-access-token.command';
import { BlacklistedAccessTokenRepository } from 'src/auth/repositories/blacklisted-access-token.repository';

@CommandHandler(BlacklistAccessTokenCommand)
export class BlacklistAccessTokenHandler implements ICommandHandler<BlacklistAccessTokenCommand> {
    constructor(
        private readonly blacklistedAccessTokenRepository: BlacklistedAccessTokenRepository,
    ) {}

    async execute({ token }: BlacklistAccessTokenCommand): Promise<void> {
        await this.blacklistedAccessTokenRepository.create(token);
    }
}
