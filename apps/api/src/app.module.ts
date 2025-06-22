import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { validateEnv } from 'src/utils/validate-env';
import { PickingSlipsModule } from './picking-slips/picking-slips.module';
import { AllExceptionsFilter } from 'src/all-exceptions.filter';
import { SnakeCaseInterceptor } from 'src/snake-case.interceptor';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        DatabaseModule,
        PickingSlipsModule,
    ],
    providers: [AllExceptionsFilter, SnakeCaseInterceptor],
})
export class AppModule {}
