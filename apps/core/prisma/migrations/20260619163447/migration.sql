-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_course_no_fkey" FOREIGN KEY ("course_no") REFERENCES "course_info"("course_no") ON DELETE RESTRICT ON UPDATE CASCADE;
