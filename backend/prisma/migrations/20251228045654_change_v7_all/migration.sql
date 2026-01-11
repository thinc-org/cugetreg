/*
  Warnings:

  - The values [MO,TU,WE,TH,FR,SA,SU,AR,IA] on the enum `day_of_week` will be removed. If these variants are still used in the database, this will fail.
  - The values [NO,SC,SO,HU,IN] on the enum `gen_ed_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [S,T,I] on the enum `study_program` will be removed. If these variants are still used in the database, this will fail.
  - The values [PUB,PVT] on the enum `visible` will be removed. If these variants are still used in the database, this will fail.
  - The values [L,D] on the enum `vote_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "day_of_week_new" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'ARRANGED', 'IRREGULAR');
ALTER TABLE "course_class" ALTER COLUMN "day_of_week" TYPE "day_of_week_new" USING ("day_of_week"::text::"day_of_week_new");
ALTER TYPE "day_of_week" RENAME TO "day_of_week_old";
ALTER TYPE "day_of_week_new" RENAME TO "day_of_week";
DROP TYPE "public"."day_of_week_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "gen_ed_type_new" AS ENUM ('NOT_GENED', 'SCIENCE', 'SOCIAL', 'HUMAN', 'INTEGRATED');
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

-- AlterEnum
BEGIN;
CREATE TYPE "study_program_new" AS ENUM ('SPECIAL', 'THAI', 'INTERNATIONAL');
ALTER TABLE "course" ALTER COLUMN "study_program" TYPE "study_program_new" USING ("study_program"::text::"study_program_new");
ALTER TABLE "cart" ALTER COLUMN "study_program" TYPE "study_program_new" USING ("study_program"::text::"study_program_new");
ALTER TABLE "review" ALTER COLUMN "study_program" TYPE "study_program_new" USING ("study_program"::text::"study_program_new");
ALTER TYPE "study_program" RENAME TO "study_program_old";
ALTER TYPE "study_program_new" RENAME TO "study_program";
DROP TYPE "public"."study_program_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "visible_new" AS ENUM ('PUBLIC', 'PRIVATE');
ALTER TABLE "public"."cart" ALTER COLUMN "visible" DROP DEFAULT;
ALTER TABLE "cart" ALTER COLUMN "visible" TYPE "visible_new" USING ("visible"::text::"visible_new");
ALTER TYPE "visible" RENAME TO "visible_old";
ALTER TYPE "visible_new" RENAME TO "visible";
DROP TYPE "public"."visible_old";
ALTER TABLE "cart" ALTER COLUMN "visible" SET DEFAULT 'PRIVATE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "vote_type_new" AS ENUM ('LIKE', 'DISLIKE');
ALTER TABLE "review_votes" ALTER COLUMN "vote_type" TYPE "vote_type_new" USING ("vote_type"::text::"vote_type_new");
ALTER TYPE "vote_type" RENAME TO "vote_type_old";
ALTER TYPE "vote_type_new" RENAME TO "vote_type";
DROP TYPE "public"."vote_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "visible" SET DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "course" ALTER COLUMN "gen_ed_type" SET DEFAULT 'NOT_GENED';

-- AlterTable
ALTER TABLE "course_section" ALTER COLUMN "gen_ed_type" SET DEFAULT 'NOT_GENED';
