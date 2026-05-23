import type { Review } from "./migrate_interface.js";
import { migrateReview, safeFsJsonRead } from "./migrate_service.js";

export async function runReviewMigration() {
  const reviewsData = safeFsJsonRead<Review[]>("reviews.json");

  console.log("Starting Migrate Reviews");

  await Promise.all(reviewsData.map((item) => migrateReview(item)));
}
