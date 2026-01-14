/*
  Warnings:

  - The values [MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY,ARRANGED,IRREGULAR] on the enum `day_of_week` will be removed. If these variants are still used in the database, this will fail.
  - The values [NOT_GENED,SCIENCE,SOCIAL,HUMAN,INTERDISCIPLINARY] on the enum `gen_ed_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [PUBLIC,PRIVATE] on the enum `visible` will be removed. If these variants are still used in the database, this will fail.
  - The values [LIKE,DISLIKE] on the enum `vote_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "grading_type" AS ENUM ('LETTER', 'SU', 'TBA');

-- AlterEnum
BEGIN;
CREATE TYPE "day_of_week_new" AS ENUM ('MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU', 'AR', 'IR');
ALTER TABLE "course_class" ALTER COLUMN "day_of_week" TYPE "day_of_week_new" USING ("day_of_week"::text::"day_of_week_new");
ALTER TYPE "day_of_week" RENAME TO "day_of_week_old";
ALTER TYPE "day_of_week_new" RENAME TO "day_of_week";
DROP TYPE "public"."day_of_week_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "gen_ed_type_new" AS ENUM ('NO', 'SC', 'SO', 'HU', 'IN');
ALTER TABLE "public"."course" ALTER COLUMN "gen_ed_type" DROP DEFAULT;
ALTER TABLE "public"."course_section" ALTER COLUMN "gen_ed_type" DROP DEFAULT;
ALTER TABLE "course" ALTER COLUMN "gen_ed_type" TYPE "gen_ed_type_new" USING ("gen_ed_type"::text::"gen_ed_type_new");
ALTER TABLE "course_section" ALTER COLUMN "gen_ed_type" TYPE "gen_ed_type_new" USING ("gen_ed_type"::text::"gen_ed_type_new");
ALTER TYPE "gen_ed_type" RENAME TO "gen_ed_type_old";
ALTER TYPE "gen_ed_type_new" RENAME TO "gen_ed_type";
DROP TYPE "public"."gen_ed_type_old";
ALTER TABLE "course" ALTER COLUMN "gen_ed_type" SET DEFAULT 'NO';
ALTER TABLE "course_section" ALTER COLUMN "gen_ed_type" SET DEFAULT 'NO';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "visible_new" AS ENUM ('PUB', 'PVT');
ALTER TABLE "public"."cart" ALTER COLUMN "visible" DROP DEFAULT;
ALTER TABLE "cart" ALTER COLUMN "visible" TYPE "visible_new" USING ("visible"::text::"visible_new");
ALTER TYPE "visible" RENAME TO "visible_old";
ALTER TYPE "visible_new" RENAME TO "visible";
DROP TYPE "public"."visible_old";
ALTER TABLE "cart" ALTER COLUMN "visible" SET DEFAULT 'PVT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "vote_type_new" AS ENUM ('L', 'D');
ALTER TABLE "review_votes" ALTER COLUMN "vote_type" TYPE "vote_type_new" USING ("vote_type"::text::"vote_type_new");
ALTER TYPE "vote_type" RENAME TO "vote_type_old";
ALTER TYPE "vote_type_new" RENAME TO "vote_type";
DROP TYPE "public"."vote_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "visible" SET DEFAULT 'PVT';

-- AlterTable
ALTER TABLE "course" ALTER COLUMN "gen_ed_type" SET DEFAULT 'NO';

-- AlterTable
ALTER TABLE "course_section" ALTER COLUMN "gen_ed_type" SET DEFAULT 'NO';
