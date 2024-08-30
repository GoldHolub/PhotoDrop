ALTER TABLE "photographers" ADD COLUMN "role" varchar(50) DEFAULT 'photographer';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(50) DEFAULT 'client';