/*
  Warnings:

  - A unique constraint covering the columns `[plan_id,year_of_study,semester,course_no]` on the table `study_plan_item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "study_plan_item_plan_id_course_no_key";

-- CreateIndex
CREATE UNIQUE INDEX "study_plan_item_plan_id_year_of_study_semester_course_no_key" ON "study_plan_item"("plan_id", "year_of_study", "semester", "course_no");
