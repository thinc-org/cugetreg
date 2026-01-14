-- CreateEnum
CREATE TYPE "semester" AS ENUM ('1', '2', '3');

-- CreateEnum
CREATE TYPE "study_program" AS ENUM ('S', 'T', 'I');

-- CreateEnum
CREATE TYPE "gen_ed_type" AS ENUM ('NO', 'SC', 'SO', 'HU', 'IN');

-- CreateEnum
CREATE TYPE "day_of_week" AS ENUM ('MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU', 'AR', 'IA');

-- CreateEnum
CREATE TYPE "review_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "vote_type" AS ENUM ('L', 'D');

-- CreateEnum
CREATE TYPE "visible" AS ENUM ('PUB', 'PVT');

-- CreateTable
CREATE TABLE "course_info" (
    "course_no" TEXT NOT NULL,
    "abbr_name" TEXT NOT NULL,
    "course_name_en" TEXT NOT NULL,
    "course_name_th" TEXT NOT NULL,
    "course_desc_en" TEXT,
    "course_desc_th" TEXT,
    "faculty" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "credit" DECIMAL(65,30) NOT NULL,
    "credit_hours" TEXT NOT NULL,

    CONSTRAINT "course_info_pkey" PRIMARY KEY ("course_no")
);

-- CreateTable
CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "study_program" "study_program" NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "semester" "semester" NOT NULL,
    "course_no" TEXT NOT NULL,
    "course_condition" TEXT,
    "midterm_start" TIMESTAMP(3),
    "midterm_end" TIMESTAMP(3),
    "final_start" TIMESTAMP(3),
    "final_end" TIMESTAMP(3),
    "gen_ed_type" "gen_ed_type" NOT NULL DEFAULT 'NO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_section" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "section_no" INTEGER NOT NULL,
    "closed" BOOLEAN NOT NULL,
    "regis" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "note" TEXT,
    "gen_ed_type" "gen_ed_type" NOT NULL DEFAULT 'NO',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_class" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "day_of_week" "day_of_week" NOT NULL,
    "period_start" TEXT NOT NULL,
    "period_end" TEXT NOT NULL,
    "building" TEXT,
    "room" TEXT,
    "professors" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "google_id" TEXT NOT NULL,
    "faculty" TEXT,
    "department" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "study_program" "study_program" NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "semester" "semester" NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Untitled',
    "visible" "visible" NOT NULL DEFAULT 'PVT',
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "cart_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "course_no" TEXT NOT NULL,
    "section_no" INTEGER NOT NULL,
    "color" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "cart_order" INTEGER NOT NULL,
    "is_graded" BOOLEAN NOT NULL DEFAULT false,
    "expected_grade" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "study_program" "study_program" NOT NULL,
    "academic_year" INTEGER NOT NULL,
    "semester" "semester" NOT NULL,
    "course_no" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "status" "review_status" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_votes" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vote_type" "vote_type" NOT NULL,

    CONSTRAINT "review_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_study_program_academic_year_semester_course_no_key" ON "course"("study_program", "academic_year", "semester", "course_no");

-- CreateIndex
CREATE UNIQUE INDEX "course_section_course_id_section_no_key" ON "course_section"("course_id", "section_no");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_google_id_key" ON "user"("google_id");

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_course_no_fkey" FOREIGN KEY ("course_no") REFERENCES "course_info"("course_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_section" ADD CONSTRAINT "course_section_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_class" ADD CONSTRAINT "course_class_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "course_section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_course_no_fkey" FOREIGN KEY ("course_no") REFERENCES "course_info"("course_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "review"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
