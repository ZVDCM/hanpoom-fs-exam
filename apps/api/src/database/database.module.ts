import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Env } from 'src/utils/validate-env';
import * as pickingSlipSchemas from '../picking-slips/schema';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

const DATABASE_PROVIDER = {
    provide: DATABASE_CONNECTION,
    useFactory: async (configService: ConfigService) => {
        const dbUrl = configService.get<Env['DB_URL']>('DB_URL');
        const pool = new Pool({
            connectionString: dbUrl,
        });
        return drizzle({
            client: pool,
            schema: {
                ...pickingSlipSchemas,
            },
        });
    },
    inject: [ConfigService],
} as const satisfies Provider;

@Module({
    providers: [DATABASE_PROVIDER],
    exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
