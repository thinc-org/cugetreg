import * as fs from "fs";
import { Effect } from "effect";
import { migrateReview, safeFsJsonRead } from "./migrate_service.js";
import type { Review } from "./migrate_interface.js";

export const runReviewMigration = Effect.gen(function* () {
  const reviewsData = yield* safeFsJsonRead<Review[]>("reviews.json");

  console.log("Starting Migrate Reviews");

  const migrationReviewsProgram = yield* Effect.forEach(
    reviewsData,
    (item) => migrateReview(item),
    { discard: true, concurrency: 100 }
  );
});
