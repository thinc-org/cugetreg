/*
  Warnings:

  - A unique constraint covering the columns `[course_no,user_id]` on the table `review` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "review_course_no_user_id_key" ON "review"("course_no", "user_id");
