CREATE TABLE "bestcement"."accounts_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_date" date NOT NULL,
	"source_file_name" text,
	"source_message_id" text,
	"raw_payload" jsonb NOT NULL,
	"accounts_dashboard_data" jsonb,
	"parser_warnings" jsonb,
	"created_at" timestamp DEFAULT now(),
	"collection_target_lakhs" numeric(14, 2),
	"collection_achievement_lakhs" numeric(14, 2),
	"spend_target_lakhs" numeric(14, 2),
	"spend_achievement_lakhs" numeric(14, 2),
	"petty_cash_balance_lakhs" numeric(14, 2),
	"bills_pending_lakhs" numeric(14, 2),
	"ten_days_cash_req_cr" numeric(14, 2),
	"expected_inflow_sales_cr" numeric(14, 2),
	"cmd_payment_due_lakhs" numeric(14, 2),
	"cash_book_status_jud" varchar(255),
	"cash_book_status_jsb" varchar(255),
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "bestcement"."finance_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_date" date NOT NULL,
	"source_file_name" text,
	"source_message_id" text,
	"raw_payload" jsonb NOT NULL,
	"detected_months" jsonb,
	"plbs_status" jsonb,
	"cost_sheet_jsb" jsonb,
	"cost_sheet_jud" jsonb,
	"investor_queries" jsonb,
	"parser_warnings" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bestcement"."it_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"item" varchar(255),
	"purchase_date" date,
	"make_model" text,
	"serial_no" text,
	"specification" text,
	"stock_status" varchar(100),
	"assigned_to" text,
	"department" varchar(255),
	"designation" text,
	"place" varchar(255),
	"assigned_date" date,
	"handover_date" date,
	"status" varchar(100),
	"remarks" text,
	"code" varchar(255),
	"accessories" text,
	"new_user" text,
	"reassigned_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bestcement"."logistics_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_date" date NOT NULL,
	"source_file_name" text,
	"source_message_id" text,
	"raw_payload" jsonb NOT NULL,
	"cement_dispatch_data" jsonb,
	"raw_material_stock_data" jsonb,
	"transporter_payment_data" jsonb,
	"parser_warnings" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bestcement"."process_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_date" date NOT NULL,
	"source_file_name" text,
	"source_message_id" text,
	"raw_payload" jsonb NOT NULL,
	"daily_status_reports" jsonb,
	"closing_stock" jsonb,
	"coal_consumption" jsonb,
	"target_achievement" jsonb,
	"parser_warnings" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bestcement"."purchase_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_date" date NOT NULL,
	"source_file_name" text,
	"source_message_id" text,
	"raw_payload" jsonb NOT NULL,
	"daily_materials" jsonb,
	"monthly_important_materials" jsonb,
	"report_status" jsonb,
	"parser_warnings" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bestcement"."daily_visit_reports" ALTER COLUMN "latitude" SET DATA TYPE numeric(20, 7);--> statement-breakpoint
ALTER TABLE "bestcement"."daily_visit_reports" ALTER COLUMN "longitude" SET DATA TYPE numeric(20, 7);--> statement-breakpoint
ALTER TABLE "bestcement"."daily_visit_reports" ALTER COLUMN "dealer_total_potential" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."daily_visit_reports" ALTER COLUMN "dealer_best_potential" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."daily_visit_reports" ALTER COLUMN "today_order_mt" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."daily_visit_reports" ALTER COLUMN "today_collection_rupees" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."daily_visit_reports" ALTER COLUMN "overdue_amount" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."daily_visit_reports" ALTER COLUMN "current_dealer_outstanding_amt" SET DATA TYPE numeric(18, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bestcement"."hr_reports" ADD COLUMN "underperformers_plant" jsonb;--> statement-breakpoint
ALTER TABLE "bestcement"."hr_reports" ADD COLUMN "underperformers_ho" jsonb;--> statement-breakpoint
ALTER TABLE "bestcement"."hr_reports" ADD COLUMN "interview_candidates" jsonb;--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "area" varchar(255);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "dealer_name" varchar(255);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "responsible_person" varchar(255);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "current_month_mtd_sales" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "current_month_target" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "percentage_target_achieved" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "balance" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "prorata_sales_target" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "percentage_as_per_prorata" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "asking_rate" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "bestcement"."sales_reports" ADD COLUMN "dayofmonth" jsonb;--> statement-breakpoint
CREATE INDEX "idx_it_assets_item" ON "bestcement"."it_assets" USING btree ("item");--> statement-breakpoint
CREATE INDEX "idx_it_assets_serial_no" ON "bestcement"."it_assets" USING btree ("serial_no");--> statement-breakpoint
CREATE INDEX "idx_it_assets_assigned_to" ON "bestcement"."it_assets" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "idx_it_assets_status" ON "bestcement"."it_assets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_it_assets_purchase_date" ON "bestcement"."it_assets" USING btree ("purchase_date");