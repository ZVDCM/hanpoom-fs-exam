import { UserId } from '@repo/types';
import { timestamp, varchar, uuid, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').$type<UserId>().defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
