import type { Review } from "./migrate_interface.js";
import { bulkMigrateReviews, safeFsJsonRead } from "./migrate_service.js";

export async function runReviewMigration() {
  const reviewsData = safeFsJsonRead<Review[]>("reviews.json");

  console.log(`  Found ${reviewsData.length} reviews — bulk inserting...`);
  const result = await bulkMigrateReviews(reviewsData);
  console.log(`  Inserted ${result.count} reviews (duplicates skipped)`);
}
