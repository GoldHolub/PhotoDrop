ALTER TABLE "images" ADD COLUMN "imageData" bytea NOT NULL;--> statement-breakpoint
ALTER TABLE "images" DROP COLUMN IF EXISTS "base64_data";