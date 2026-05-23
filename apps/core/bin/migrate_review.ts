import cliProgress from "cli-progress";

import type { Review } from "./migrate_interface.js";
import {
  migrateReview,
  runConcurrent,
  safeFsJsonRead,
} from "./migrate_service.js";

const CONCURRENCY = 50;

export async function runReviewMigration() {
  const reviewsData = safeFsJsonRead<Review[]>("reviews.json");

  const bar = new cliProgress.SingleBar(
    { format: "  Reviews  [{bar}] {value}/{total} ({percentage}%)" },
    cliProgress.Presets.shades_classic,
  );
  bar.start(reviewsData.length, 0);

  await runConcurrent(reviewsData, CONCURRENCY, async (item) => {
    await migrateReview(item);
    bar.increment();
  });

  bar.stop();
}
