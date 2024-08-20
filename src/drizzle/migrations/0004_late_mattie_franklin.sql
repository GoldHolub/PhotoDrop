ALTER TABLE "users" ADD COLUMN "telegram_chat_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_telegram_chat_id_unique" UNIQUE("telegram_chat_id");