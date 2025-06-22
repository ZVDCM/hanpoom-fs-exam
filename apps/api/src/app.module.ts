import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { validateEnv } from 'src/utils/validate-env';
import { PickingSlipsModule } from './picking-slips/picking-slips.module';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { SnakeCaseInterceptor } from 'src/snake-case.interceptor';
import { AuthModule } from './auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        CqrsModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        DatabaseModule,
        PickingSlipsModule,
        AuthModule,
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 10,
                },
            ],
        }),
    ],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
        AllExceptionsFilter,
        SnakeCaseInterceptor,
    ],
})
export class AppModule {}
