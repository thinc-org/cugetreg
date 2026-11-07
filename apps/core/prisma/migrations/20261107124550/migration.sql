-- CreateTable
CREATE TABLE "curriculum" (
    "id" TEXT NOT NULL,
    "faculty" "Faculty" NOT NULL,
    "department" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_category" (
    "id" TEXT NOT NULL,
    "curriculum_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "curriculum_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "curriculum_requirement" (
    "id" TEXT NOT NULL,
    "curriculum_id" TEXT NOT NULL,
    "year_of_study" INTEGER NOT NULL,
    "semester" "semester" NOT NULL,
    "course_no" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "curriculum_requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "official_credit_target" (
    "id" TEXT NOT NULL,
    "curriculum_id" TEXT NOT NULL,
    "year_of_study" INTEGER,
    "semester" "semester",
    "category_id" TEXT NOT NULL,
    "target_credit" INTEGER NOT NULL,

    CONSTRAINT "official_credit_target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_credit_target" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "year_of_study" INTEGER,
    "semester" "semester",
    "category_id" TEXT NOT NULL,
    "target_credit" INTEGER NOT NULL,

    CONSTRAINT "custom_credit_target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plan" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'แผนการเรียนของฉัน',
    "curriculum_id" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "extra_terms" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_category" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "curriculum_category_id" TEXT,

    CONSTRAINT "plan_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plan_item" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "year_of_study" INTEGER NOT NULL,
    "semester" "semester" NOT NULL,
    "course_no" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "requirement_id" TEXT,
    "is_graded" BOOLEAN NOT NULL DEFAULT false,
    "expected_grade" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "item_order" TEXT NOT NULL DEFAULT '0|hzzzzz:',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plan_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_category_curriculum_id_name_key" ON "curriculum_category"("curriculum_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "curriculum_requirement_curriculum_id_year_of_study_semester_key" ON "curriculum_requirement"("curriculum_id", "year_of_study", "semester", "course_no");

-- CreateIndex
CREATE UNIQUE INDEX "official_credit_target_curriculum_id_year_of_study_semester_key" ON "official_credit_target"("curriculum_id", "year_of_study", "semester", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_credit_target_plan_id_year_of_study_semester_categor_key" ON "custom_credit_target"("plan_id", "year_of_study", "semester", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "plan_category_plan_id_name_key" ON "plan_category"("plan_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "study_plan_item_plan_id_course_no_key" ON "study_plan_item"("plan_id", "course_no");

-- AddForeignKey
ALTER TABLE "curriculum_category" ADD CONSTRAINT "curriculum_category_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_requirement" ADD CONSTRAINT "curriculum_requirement_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_requirement" ADD CONSTRAINT "curriculum_requirement_course_no_fkey" FOREIGN KEY ("course_no") REFERENCES "course_info"("course_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "curriculum_requirement" ADD CONSTRAINT "curriculum_requirement_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "curriculum_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "official_credit_target" ADD CONSTRAINT "official_credit_target_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "official_credit_target" ADD CONSTRAINT "official_credit_target_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "curriculum_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_credit_target" ADD CONSTRAINT "custom_credit_target_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "study_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_credit_target" ADD CONSTRAINT "custom_credit_target_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "plan_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan" ADD CONSTRAINT "study_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan" ADD CONSTRAINT "study_plan_curriculum_id_fkey" FOREIGN KEY ("curriculum_id") REFERENCES "curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_category" ADD CONSTRAINT "plan_category_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "study_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_category" ADD CONSTRAINT "plan_category_curriculum_category_id_fkey" FOREIGN KEY ("curriculum_category_id") REFERENCES "curriculum_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_item" ADD CONSTRAINT "study_plan_item_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "study_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_item" ADD CONSTRAINT "study_plan_item_course_no_fkey" FOREIGN KEY ("course_no") REFERENCES "course_info"("course_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_item" ADD CONSTRAINT "study_plan_item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "plan_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_item" ADD CONSTRAINT "study_plan_item_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "curriculum_requirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
