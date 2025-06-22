import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { RegisterHandler } from 'src/auth/commands/register/register.handler';
import { UserRepository } from 'src/auth/repositories/user.repository';

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [UserRepository, RegisterHandler],
})
export class AuthModule {}
