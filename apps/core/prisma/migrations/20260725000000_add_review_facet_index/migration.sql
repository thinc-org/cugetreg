CREATE INDEX CONCURRENTLY "review_course_no_status_academic_year_semester_idx" ON "review"("course_no", "status", "academic_year", "semester");

CREATE INDEX CONCURRENTLY "review_course_no_status_created_at_id_idx" ON "review"("course_no", "status", "created_at" DESC, "id" DESC);
