import type { Review } from "./migrate_interface.js";
import { bulkMigrateReviews, safeFsJsonRead } from "./migrate_service.js";

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export async function runReviewMigration() {
  const reviewsData = safeFsJsonRead<Review[]>("reviews.json");

  let i = 0;
  const timer = setInterval(() => {
    process.stdout.write(
      `\r  Reviews    ${SPINNER[i++ % SPINNER.length]} bulk inserting ${reviewsData.length} rows...`,
    );
  }, 80);

  const result = await bulkMigrateReviews(reviewsData);

  clearInterval(timer);
  process.stdout.write(
    `\r  Reviews    ✔ ${result.count} inserted (duplicates skipped)\n`,
  );
}
