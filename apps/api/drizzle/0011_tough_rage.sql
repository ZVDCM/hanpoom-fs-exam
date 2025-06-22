ALTER TABLE "blacklisted_access_tokens" RENAME COLUMN "token" TO "token_hash";--> statement-breakpoint
ALTER TABLE "blacklisted_access_tokens" DROP CONSTRAINT "blacklisted_access_tokens_token_unique";--> statement-breakpoint
ALTER TABLE "blacklisted_access_tokens" ADD CONSTRAINT "blacklisted_access_tokens_token_hash_unique" UNIQUE("token_hash");