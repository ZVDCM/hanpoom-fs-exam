import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    DB_URL: z.string().default('./data/db.sqlite'),
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
