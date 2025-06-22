import { BlacklistedAccessTokenId, RefreshTokenId, UserId } from '@repo/types';
import { relations } from 'drizzle-orm';
import { timestamp, varchar, uuid, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').$type<UserId>().defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const refreshTokens = pgTable('refresh_tokens', {
    id: uuid('id').$type<RefreshTokenId>().defaultRandom().primaryKey(),
    userId: uuid('user_id').$type<UserId>().notNull().unique(),
    tokenHash: varchar('token_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const blacklistedAccessTokens = pgTable('blacklisted_access_tokens', {
    id: uuid('id').$type<BlacklistedAccessTokenId>().defaultRandom().primaryKey(),
    userId: uuid('user_id').$type<UserId>().notNull(),
    tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
    tokens: many(refreshTokens),
    blackListedTokens: many(blacklistedAccessTokens),
}));
