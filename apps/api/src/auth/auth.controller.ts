import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from 'src/auth/commands/register/register.command';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        await this.commandBus.execute(
            new RegisterCommand(createUserDto.email, createUserDto.password),
        );
    }
}
