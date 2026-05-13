CREATE SCHEMA "eurofoam";
--> statement-breakpoint
CREATE TABLE "eurofoam"."daily_visit_reports" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_date" date,
	"dealer_type" varchar(50),
	"visit_type" varchar(50),
	"location" varchar(500),
	"latitude" numeric(20, 7),
	"longitude" numeric(20, 7),
	"brand_selling" text[],
	"name_of_party" varchar(255),
	"contact_no_of_party" varchar(20),
	"expected_activation_date" date,
	"current_dealer_outstanding_amt" numeric(18, 2),
	"today_order_qty" numeric(18, 2),
	"today_collection_rupees" numeric(18, 2),
	"overdue_amount" numeric(18, 2),
	"feedbacks" varchar(500),
	"check_in_time" timestamp (6) with time zone,
	"check_out_time" timestamp (6) with time zone,
	"time_spent_in_loc" varchar(255),
	"in_time_image_url" varchar(500),
	"out_time_image_url" varchar(500),
	"user_id" integer NOT NULL,
	"pjp_id" varchar(255),
	"dealer_id" varchar(255),
	"idempotency_key" varchar(255),
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."dealers" (
	"id" serial PRIMARY KEY NOT NULL,
	"dealer_party_name" varchar(255) NOT NULL,
	"contact_person_name" varchar(255),
	"contact_person_number" varchar(20),
	"email" varchar(255),
	"gst_no" varchar(50),
	"pan_no" varchar(50),
	"zone" varchar(120),
	"district" varchar(120),
	"area" varchar(120),
	"state" varchar(100),
	"pin_code" varchar(20),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."geo_tracking" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"latitude" numeric(10, 7) NOT NULL,
	"longitude" numeric(10, 7) NOT NULL,
	"recorded_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"accuracy" numeric(10, 2),
	"is_active" boolean DEFAULT true NOT NULL,
	"total_distance_travelled" numeric(10, 3),
	"location_type" varchar(50),
	"check_in_time" timestamp(6) with time zone,
	"check_out_time" timestamp(6) with time zone,
	"dest_lat" numeric(10, 7),
	"dest_lng" numeric(10, 7),
	"journey_id" text,
	"dealer_id" varchar(255),
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."journey_breadcrumbs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"journey_id" varchar(255) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"total_distance" double precision DEFAULT 0 NOT NULL,
	"h3_index" varchar(15),
	"recorded_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"is_synced" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."journey_ops" (
	"server_seq" bigserial PRIMARY KEY NOT NULL,
	"op_id" uuid NOT NULL,
	"journey_id" varchar(255) NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"app_role" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "journey_ops_op_id_key" UNIQUE("op_id")
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."journeys" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"pjp_id" varchar(255),
	"dealer_id" varchar(255),
	"dest_name" varchar(255),
	"dest_lat" numeric(10, 7),
	"dest_lng" numeric(10, 7),
	"status" varchar(50) DEFAULT 'ACTIVE' NOT NULL,
	"is_active" boolean DEFAULT true,
	"start_time" timestamp with time zone DEFAULT now() NOT NULL,
	"end_time" timestamp with time zone,
	"total_distance" numeric(10, 3) DEFAULT '0',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_synced" boolean DEFAULT false,
	"app_role" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."permanent_journey_plans" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"created_by_id" integer NOT NULL,
	"plan_date" date NOT NULL,
	"area_to_be_visited" varchar(500) NOT NULL,
	"description" varchar(500),
	"status" varchar(50) NOT NULL,
	"verification_status" varchar(50),
	"additional_visit_remarks" varchar(500),
	"dealer_id" varchar(255),
	"bulk_op_id" varchar(50),
	"idempotency_key" varchar(120),
	"site_id" uuid,
	"route" varchar(500),
	"diversion_reason" varchar(500),
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"org_role" varchar(100),
	"job_role" varchar(100),
	"granted_perms" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"perm_description" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."salesman_attendance" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"attendance_date" date NOT NULL,
	"location_name" varchar(500) NOT NULL,
	"in_time_timestamp" timestamp(6) with time zone NOT NULL,
	"out_time_timestamp" timestamp(6) with time zone,
	"in_time_image_captured" boolean NOT NULL,
	"out_time_image_captured" boolean NOT NULL,
	"in_time_image_url" varchar(500),
	"out_time_image_url" varchar(500),
	"in_time_latitude" numeric(10, 7) NOT NULL,
	"in_time_longitude" numeric(10, 7) NOT NULL,
	"out_time_latitude" numeric(10, 7),
	"out_time_longitude" numeric(10, 7),
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"role" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."salesman_leave_applications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"leave_type" varchar(100) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"reason" varchar(500) NOT NULL,
	"status" varchar(50) NOT NULL,
	"admin_remarks" varchar(500),
	"app_role" varchar(50),
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."sync_state" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"last_server_seq" bigint DEFAULT 0 NOT NULL,
	CONSTRAINT "one_row_only" CHECK (id = 1)
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."user_roles" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "eurofoam"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"username" text,
	"phone_number" varchar(50),
	"role" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"area" varchar(100),
	"zone" varchar(100),
	"is_dashboard_user" boolean DEFAULT false NOT NULL,
	"dashboard_login_id" text,
	"dashboard_hashed_password" text,
	"is_sales_app_user" boolean DEFAULT false NOT NULL,
	"salesman_login_id" text,
	"sales_app_password" text,
	"reports_to_id" integer,
	"device_id" varchar(255),
	"fcm_token" varchar(500),
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "uniq_user_device_id" UNIQUE("device_id")
);
--> statement-breakpoint
ALTER TABLE "eurofoam"."daily_visit_reports" ADD CONSTRAINT "daily_visit_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eurofoam"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."daily_visit_reports" ADD CONSTRAINT "daily_visit_reports_pjp_id_fkey" FOREIGN KEY ("pjp_id") REFERENCES "eurofoam"."permanent_journey_plans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."daily_visit_reports" ADD CONSTRAINT "daily_visit_reports_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "eurofoam"."dealers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."geo_tracking" ADD CONSTRAINT "geo_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eurofoam"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "eurofoam"."geo_tracking" ADD CONSTRAINT "geo_tracking_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "eurofoam"."journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."geo_tracking" ADD CONSTRAINT "geo_tracking_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "eurofoam"."dealers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."journey_breadcrumbs" ADD CONSTRAINT "journey_breadcrumbs_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "eurofoam"."journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."journey_ops" ADD CONSTRAINT "fk_journey_ops_user" FOREIGN KEY ("user_id") REFERENCES "eurofoam"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "eurofoam"."journey_ops" ADD CONSTRAINT "fk_journey_ops_journey" FOREIGN KEY ("journey_id") REFERENCES "eurofoam"."journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."journeys" ADD CONSTRAINT "journeys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eurofoam"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."journeys" ADD CONSTRAINT "journeys_pjp_id_fkey" FOREIGN KEY ("pjp_id") REFERENCES "eurofoam"."permanent_journey_plans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."journeys" ADD CONSTRAINT "journeys_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "eurofoam"."dealers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."permanent_journey_plans" ADD CONSTRAINT "permanent_journey_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eurofoam"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "eurofoam"."permanent_journey_plans" ADD CONSTRAINT "permanent_journey_plans_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "eurofoam"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "eurofoam"."permanent_journey_plans" ADD CONSTRAINT "permanent_journey_plans_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "eurofoam"."dealers"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "eurofoam"."salesman_attendance" ADD CONSTRAINT "salesman_attendance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eurofoam"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "eurofoam"."salesman_leave_applications" ADD CONSTRAINT "salesman_leave_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eurofoam"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "eurofoam"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "eurofoam"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "eurofoam"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eurofoam"."users" ADD CONSTRAINT "users_reports_to_id_fkey" FOREIGN KEY ("reports_to_id") REFERENCES "eurofoam"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_daily_visit_reports_user_id" ON "eurofoam"."daily_visit_reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_daily_visit_reports_pjp_id" ON "eurofoam"."daily_visit_reports" USING btree ("pjp_id");--> statement-breakpoint
CREATE INDEX "idx_verified_zone" ON "eurofoam"."dealers" USING btree ("zone");--> statement-breakpoint
CREATE INDEX "idx_verified_district" ON "eurofoam"."dealers" USING btree ("district");--> statement-breakpoint
CREATE INDEX "idx_verified_pincode" ON "eurofoam"."dealers" USING btree ("pin_code");--> statement-breakpoint
CREATE INDEX "idx_verified_gst" ON "eurofoam"."dealers" USING btree ("gst_no");--> statement-breakpoint
CREATE INDEX "idx_geo_active" ON "eurofoam"."geo_tracking" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_geo_dealer_id" ON "eurofoam"."geo_tracking" USING btree ("dealer_id");--> statement-breakpoint
CREATE INDEX "idx_geo_journey_time" ON "eurofoam"."geo_tracking" USING btree ("journey_id","recorded_at");--> statement-breakpoint
CREATE INDEX "idx_geo_tracking_recorded_at" ON "eurofoam"."geo_tracking" USING btree ("recorded_at");--> statement-breakpoint
CREATE INDEX "idx_geo_tracking_user_id" ON "eurofoam"."geo_tracking" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_geo_user_time" ON "eurofoam"."geo_tracking" USING btree ("user_id","recorded_at");--> statement-breakpoint
CREATE INDEX "idx_breadcrumbs_h3" ON "eurofoam"."journey_breadcrumbs" USING btree ("h3_index");--> statement-breakpoint
CREATE INDEX "idx_breadcrumbs_journey_time" ON "eurofoam"."journey_breadcrumbs" USING btree ("journey_id","recorded_at");--> statement-breakpoint
CREATE INDEX "idx_journey_ops_created" ON "eurofoam"."journey_ops" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_journey_ops_journey" ON "eurofoam"."journey_ops" USING btree ("journey_id");--> statement-breakpoint
CREATE INDEX "idx_journey_ops_server_seq" ON "eurofoam"."journey_ops" USING btree ("server_seq");--> statement-breakpoint
CREATE INDEX "idx_journey_ops_user" ON "eurofoam"."journey_ops" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_journeys_user_status" ON "eurofoam"."journeys" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "idx_permanent_journey_plans_created_by_id" ON "eurofoam"."permanent_journey_plans" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "idx_permanent_journey_plans_user_id" ON "eurofoam"."permanent_journey_plans" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_pjp_bulk_op_id" ON "eurofoam"."permanent_journey_plans" USING btree ("bulk_op_id");--> statement-breakpoint
CREATE INDEX "idx_pjp_dealer_id" ON "eurofoam"."permanent_journey_plans" USING btree ("dealer_id");--> statement-breakpoint
CREATE INDEX "idx_pjp_site_id" ON "eurofoam"."permanent_journey_plans" USING btree ("site_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_pjp_idempotency_key_not_null" ON "eurofoam"."permanent_journey_plans" USING btree ("idempotency_key") WHERE (idempotency_key IS NOT NULL);--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_pjp_user_dealer_plan_date" ON "eurofoam"."permanent_journey_plans" USING btree ("user_id","dealer_id","plan_date");--> statement-breakpoint
CREATE INDEX "idx_salesman_attendance_user_id" ON "eurofoam"."salesman_attendance" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_salesman_leave_applications_user_id" ON "eurofoam"."salesman_leave_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_device_id" ON "eurofoam"."users" USING btree ("device_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_salesman_login_id_key" ON "eurofoam"."users" USING btree ("salesman_login_id");--> statement-breakpoint
CREATE INDEX "idx_users_reports_to_id" ON "eurofoam"."users" USING btree ("reports_to_id");