DO $$ BEGIN
 CREATE TYPE "public"."day_of_week" AS ENUM('MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gen_ed_type" AS ENUM('NO', 'SC', 'SO', 'HU', 'IN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."semester" AS ENUM('1', '2', '3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."study_program" AS ENUM('S', 'T', 'I');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course" (
	"id" text PRIMARY KEY NOT NULL,
	"study_program" "study_program" NOT NULL,
	"academic_year" integer NOT NULL,
	"semester" "semester" NOT NULL,
	"course_no" text NOT NULL,
	"abbr_name" text NOT NULL,
	"course_name_en" text NOT NULL,
	"course_name_th" text NOT NULL,
	"course_desc_en" text,
	"course_desc_th" text,
	"faculty" text NOT NULL,
	"department" text NOT NULL,
	"credit" real NOT NULL,
	"credit_hours" text NOT NULL,
	"course_condition" text,
	"midterm_start" timestamp,
	"midterm_end" timestamp,
	"final_start" timestamp,
	"final_end" timestamp,
	"gen_ed_type" "gen_ed_type" DEFAULT 'NO' NOT NULL,
	"rating" double precision,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_unique" UNIQUE("study_program","academic_year","semester","course_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_section" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"course_no" text NOT NULL,
	"section_no" integer NOT NULL,
	"closed" boolean NOT NULL,
	"regis" integer NOT NULL,
	"max" integer NOT NULL,
	"note" text,
	CONSTRAINT "section_unique" UNIQUE("course_id","course_no","section_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_class" (
	"id" text PRIMARY KEY NOT NULL,
	"section_id" text NOT NULL,
	"type" text NOT NULL,
	"day_of_week" "day_of_week",
	"period_start" text,
	"period_end" text,
	"building" text,
	"room" text,
	"professors" text[]
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_section" ADD CONSTRAINT "course_section_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_class" ADD CONSTRAINT "course_class_section_id_course_section_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."course_section"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
