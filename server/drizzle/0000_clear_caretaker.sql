-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "timesheet";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timesheet"."roles" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar(50) NOT NULL,
	CONSTRAINT "roles_role_name_key" UNIQUE("role_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timesheet"."employees" (
	"employee_id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role_id" integer,
	"date_hired" date NOT NULL,
	"activation_token" varchar(255),
	"activation_token_expires" bigint,
	"is_active" boolean DEFAULT false,
	CONSTRAINT "employees_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "timesheet"."timeentries" (
	"entry_id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"clock_in" timestamp with time zone NOT NULL,
	"clock_out" timestamp with time zone,
	"total_hours" varchar GENERATED ALWAYS AS ((((floor((EXTRACT(epoch FROM (clock_out - clock_in)) / (3600)::numeric)) || ' hours '::text) || floor(((EXTRACT(epoch FROM (clock_out - clock_in)) % (3600)::numeric) / (60)::numeric))) || ' minutes'::text)) STORED,
	"entry_date" date DEFAULT CURRENT_DATE NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timesheet"."employees" ADD CONSTRAINT "employees_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "timesheet"."roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "timesheet"."timeentries" ADD CONSTRAINT "timeentries_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "timesheet"."employees"("employee_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/