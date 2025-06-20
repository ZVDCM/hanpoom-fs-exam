import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

const DATABASE_PROVIDER = {
    provide: DATABASE_CONNECTION,
    useFactory: async (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DB_URL');
        const pool = new Pool({
            connectionString: dbUrl,
        });
        return drizzle({ client: pool });
    },
    inject: [ConfigService],
} as const satisfies Provider;

@Module({
    providers: [DATABASE_PROVIDER],
    exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
