/*
  Warnings:

  - The values [1,2,3] on the enum `semester` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "semester_new" AS ENUM ('FIRST', 'SECOND', 'SUMMER');
ALTER TABLE "course" ALTER COLUMN "semester" TYPE "semester_new" USING ("semester"::text::"semester_new");
ALTER TABLE "cart" ALTER COLUMN "semester" TYPE "semester_new" USING ("semester"::text::"semester_new");
ALTER TABLE "review" ALTER COLUMN "semester" TYPE "semester_new" USING ("semester"::text::"semester_new");
ALTER TYPE "semester" RENAME TO "semester_old";
ALTER TYPE "semester_new" RENAME TO "semester";
DROP TYPE "public"."semester_old";
COMMIT;
