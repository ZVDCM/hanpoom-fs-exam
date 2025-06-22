CREATE TABLE "blacklisted_access_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blacklisted_access_tokens_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DROP INDEX "email_idx";