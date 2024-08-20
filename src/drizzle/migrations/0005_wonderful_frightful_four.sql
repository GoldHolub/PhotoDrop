CREATE TABLE IF NOT EXISTS "images_to_users" (
	"image_info_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "images_to_users_image_info_id_user_id_pk" PRIMARY KEY("image_info_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "image_info" DROP CONSTRAINT "image_info_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_to_users" ADD CONSTRAINT "images_to_users_image_info_id_image_info_id_fk" FOREIGN KEY ("image_info_id") REFERENCES "public"."image_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images_to_users" ADD CONSTRAINT "images_to_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "image_info" DROP COLUMN IF EXISTS "user_id";