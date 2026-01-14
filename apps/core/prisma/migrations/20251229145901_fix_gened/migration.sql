/*
  Warnings:

  - The values [INTEGRATED] on the enum `gen_ed_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "gen_ed_type_new" AS ENUM ('NOT_GENED', 'SCIENCE', 'SOCIAL', 'HUMAN', 'INTERDISCIPLINARY');
ALTER TABLE "public"."course" ALTER COLUMN "gen_ed_type" DROP DEFAULT;
ALTER TABLE "public"."course_section" ALTER COLUMN "gen_ed_type" DROP DEFAULT;
ALTER TABLE "course" ALTER COLUMN "gen_ed_type" TYPE "gen_ed_type_new" USING ("gen_ed_type"::text::"gen_ed_type_new");
ALTER TABLE "course_section" ALTER COLUMN "gen_ed_type" TYPE "gen_ed_type_new" USING ("gen_ed_type"::text::"gen_ed_type_new");
ALTER TYPE "gen_ed_type" RENAME TO "gen_ed_type_old";
ALTER TYPE "gen_ed_type_new" RENAME TO "gen_ed_type";
DROP TYPE "public"."gen_ed_type_old";
ALTER TABLE "course" ALTER COLUMN "gen_ed_type" SET DEFAULT 'NOT_GENED';
ALTER TABLE "course_section" ALTER COLUMN "gen_ed_type" SET DEFAULT 'NOT_GENED';
COMMIT;

-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "study_program" DROP DEFAULT;
