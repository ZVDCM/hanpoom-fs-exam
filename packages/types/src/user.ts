import { z } from 'zod';

export type UserId = string & { __brand: 'user_id' };

export const createUserSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type CreateUserType = z.infer<typeof createUserSchema>;
