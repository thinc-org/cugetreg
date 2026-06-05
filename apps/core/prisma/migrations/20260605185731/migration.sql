/*
  Warnings:

  - A unique constraint covering the columns `[user_id,review_id]` on the table `review_votes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "review_votes_user_id_review_id_key" ON "review_votes"("user_id", "review_id");
