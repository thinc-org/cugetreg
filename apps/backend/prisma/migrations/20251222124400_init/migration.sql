/*
  Warnings:

  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cart_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_class` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `course_section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review_votes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_user_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_course_no_fkey";

-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_course_no_fkey";

-- DropForeignKey
ALTER TABLE "course_class" DROP CONSTRAINT "course_class_section_id_fkey";

-- DropForeignKey
ALTER TABLE "course_section" DROP CONSTRAINT "course_section_course_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_user_id_fkey";

-- DropForeignKey
ALTER TABLE "review_votes" DROP CONSTRAINT "review_votes_review_id_fkey";

-- DropForeignKey
ALTER TABLE "review_votes" DROP CONSTRAINT "review_votes_user_id_fkey";

-- DropTable
DROP TABLE "cart";

-- DropTable
DROP TABLE "cart_item";

-- DropTable
DROP TABLE "course";

-- DropTable
DROP TABLE "course_class";

-- DropTable
DROP TABLE "course_info";

-- DropTable
DROP TABLE "course_section";

-- DropTable
DROP TABLE "review";

-- DropTable
DROP TABLE "review_votes";

-- DropTable
DROP TABLE "user";

-- DropEnum
DROP TYPE "day_of_week";

-- DropEnum
DROP TYPE "gen_ed_type";

-- DropEnum
DROP TYPE "review_status";

-- DropEnum
DROP TYPE "semester";

-- DropEnum
DROP TYPE "study_program";

-- DropEnum
DROP TYPE "visible";

-- DropEnum
DROP TYPE "vote_type";
