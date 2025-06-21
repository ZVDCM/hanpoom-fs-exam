import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { validateEnv } from 'src/utils/validate-env';
import { PickingSlipsModule } from './picking-slips/picking-slips.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
        }),
        DatabaseModule,
        PickingSlipsModule,
    ],
})
export class AppModule {}
