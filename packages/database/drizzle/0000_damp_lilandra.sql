DO $$ BEGIN
 CREATE TYPE "public"."day_of_week" AS ENUM('MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU', 'AR', 'IA');
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
DO $$ BEGIN
 CREATE TYPE "public"."review_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."vote_type" AS ENUM('L', 'D');
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
	"course_condition" text,
	"midterm_start" timestamp,
	"midterm_end" timestamp,
	"final_start" timestamp,
	"final_end" timestamp,
	"gen_ed_type" "gen_ed_type" DEFAULT 'NO' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_unique" UNIQUE("study_program","academic_year","semester","course_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_info" (
	"course_no" text PRIMARY KEY NOT NULL,
	"abbr_name" text NOT NULL,
	"course_name_en" text NOT NULL,
	"course_name_th" text NOT NULL,
	"course_desc_en" text,
	"course_desc_th" text,
	"faculty" text NOT NULL,
	"department" text NOT NULL,
	"credit" numeric NOT NULL,
	"credit_hours" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_section" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"section_no" integer NOT NULL,
	"closed" boolean NOT NULL,
	"regis" integer NOT NULL,
	"max" integer NOT NULL,
	"note" text,
	"gen_ed_type" "gen_ed_type" DEFAULT 'NO' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "section_unique" UNIQUE("course_id","section_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_class" (
	"id" text PRIMARY KEY NOT NULL,
	"section_id" text NOT NULL,
	"type" text NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"period_start" text NOT NULL,
	"period_end" text NOT NULL,
	"building" text,
	"room" text,
	"professors" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cart" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"study_program" "study_program" NOT NULL,
	"academic_year" integer NOT NULL,
	"semester" "semester" NOT NULL,
	"name" text DEFAULT 'Untitled' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cart_item" (
	"id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"course_no" text NOT NULL,
	"section_no" integer NOT NULL,
	"color" text,
	"hidden" boolean DEFAULT false NOT NULL,
	"cart_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"study_program" "study_program" NOT NULL,
	"academic_year" integer NOT NULL,
	"semester" "semester" NOT NULL,
	"course_no" text NOT NULL,
	"content" text NOT NULL,
	"rating" integer NOT NULL,
	"status" "review_status" DEFAULT 'PENDING' NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "review_votes" (
	"id" text PRIMARY KEY NOT NULL,
	"review_id" text NOT NULL,
	"user_id" text NOT NULL,
	"vote_type" "vote_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"google_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course" ADD CONSTRAINT "course_course_no_course_info_course_no_fk" FOREIGN KEY ("course_no") REFERENCES "public"."course_info"("course_no") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review" ADD CONSTRAINT "review_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_review_id_review_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."review"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
