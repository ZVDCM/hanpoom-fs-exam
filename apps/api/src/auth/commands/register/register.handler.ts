import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from 'src/auth/commands/register/register.command';
import { UserRepository } from 'src/auth/repositories/user.repository';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
    constructor(private readonly user: UserRepository) {}

    async execute({ email, password }: RegisterCommand) {
        this.user.register(email, password);
    }
}
