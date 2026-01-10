import * as fs from "fs";
import { Effect } from "effect";
import { migrateReview, safeFsJsonRead } from "./migrate_service.js";
import type { Review } from "./migrate_interface.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

export const runReviewMigration = Effect.gen(function* () {
  const reviewsData = yield* safeFsJsonRead<Review[]>("reviews.json");

  const adapter = new PrismaPg({
    connectionString:
      "postgresql://admin:cugetreg@localhost:5432/cugetreg?schema=public",
    max: 10,
  });
  const prisma = new PrismaClient({ adapter });

  console.log("Starting Migrate Reviews");

  const migrationReviewsProgram = yield* Effect.forEach(
    reviewsData,
    (item) => migrateReview(item),
    { discard: true, concurrency: 50 }
  );
});
