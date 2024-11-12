ALTER TABLE "user" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "roles" "role" DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "customerID" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "role";