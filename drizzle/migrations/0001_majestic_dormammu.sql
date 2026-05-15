ALTER TABLE "eurofoam"."daily_visit_reports" ALTER COLUMN "dealer_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "eurofoam"."permanent_journey_plans" ALTER COLUMN "dealer_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "eurofoam"."dealers" ADD COLUMN "is_verified" boolean DEFAULT false;