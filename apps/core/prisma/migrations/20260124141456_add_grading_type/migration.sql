/*
  Warnings:

  - Added the required column `academic_year` to the `course_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grading_type` to the `course_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `course_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `study_program` to the `course_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course_info" ADD COLUMN     "academic_year" INTEGER NOT NULL,
ADD COLUMN     "grading_type" "grading_type" NOT NULL,
ADD COLUMN     "semester" "semester" NOT NULL,
ADD COLUMN     "study_program" "study_program" NOT NULL;
