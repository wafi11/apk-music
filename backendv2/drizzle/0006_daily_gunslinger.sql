ALTER TABLE "queue_items" ALTER COLUMN "id" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "queue_items" ALTER COLUMN "queue_id" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "queues" ALTER COLUMN "id" SET DATA TYPE varchar(30);