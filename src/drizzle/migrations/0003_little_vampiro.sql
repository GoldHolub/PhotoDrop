CREATE TABLE IF NOT EXISTS "user_selfies" (
	"id" serial PRIMARY KEY NOT NULL,
	"selfie" bytea NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "selfie_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_selfie_id_user_selfies_id_fk" FOREIGN KEY ("selfie_id") REFERENCES "public"."user_selfies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
