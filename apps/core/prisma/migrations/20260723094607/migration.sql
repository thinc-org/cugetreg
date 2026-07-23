-- CreateTable
CREATE TABLE "course_favorite" (
    "id" TEXT NOT NULL,
    "course_no" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "course_favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_favorite_course_no_user_id_key" ON "course_favorite"("course_no", "user_id");

-- AddForeignKey
ALTER TABLE "course_favorite" ADD CONSTRAINT "course_favorite_course_no_fkey" FOREIGN KEY ("course_no") REFERENCES "course_info"("course_no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_favorite" ADD CONSTRAINT "course_favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
