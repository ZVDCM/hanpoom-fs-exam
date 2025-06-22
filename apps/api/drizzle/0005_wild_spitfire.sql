ALTER TABLE "refresh_tokens" RENAME COLUMN "password_hash" TO "token_hash";--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD COLUMN "user_id" uuid NOT NULL;