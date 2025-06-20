import { config } from 'process';
import { z } from 'zod';

export const validateEnv = (config: Record<string, unknown>) => {
    const envSchema = z.object({
        NODE_ENV: z.enum(['development', 'production']).default('development'),
        DB_URL: z.string().default('./data/db.sqlite'),
    });

    const parsedConfig = envSchema.safeParse(config);

    if (!parsedConfig.success) {
        console.error('Invalid environment configuration:', parsedConfig.error.format());
        throw new Error('Invalid environment configuration');
    }
    return parsedConfig.data;
};
