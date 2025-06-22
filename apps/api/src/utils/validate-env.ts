import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().default(3001),
    FRONTEND_URL: z.string(),
    DB_URL: z.string().default('./data/db.sqlite'),
    ACCESS_TOKEN_SECRET: z.string(),
    ACCESS_TOKEN_EXPIRATION_MS: z.coerce.number().default(900000),
    REFRESH_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_EXPIRATION_MS: z.coerce.number().default(604800000),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>) => {
    const parsedConfig = envSchema.safeParse(config);

    if (!parsedConfig.success) {
        console.error('Invalid environment configuration:', parsedConfig.error.format());
        throw new Error('Invalid environment configuration');
    }
    return parsedConfig.data;
};
