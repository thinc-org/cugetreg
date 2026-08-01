-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateIndex
CREATE INDEX "course_course_no_idx" ON "course" USING GIN ("course_no" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "course_info_faculty_idx" ON "course_info"("faculty");

-- CreateIndex
CREATE INDEX "course_info_abbr_name_idx" ON "course_info" USING GIN ("abbr_name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "course_info_course_name_en_idx" ON "course_info" USING GIN ("course_name_en" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "course_info_course_name_th_idx" ON "course_info" USING GIN ("course_name_th" gin_trgm_ops);
