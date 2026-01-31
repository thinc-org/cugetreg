import "dotenv/config";

import { Console, Effect } from "effect";

import { runCourseMigration } from "./migrate_course.js";
import { runReviewMigration } from "./migrate_review.js";
import { runUserMigration } from "./migrate_user.js";

import { PrismaLive } from "../src/db/clients.js";

const mainMigrationProgram = Effect.gen(function* () {
  yield* Console.log("Starting All Migration Process...");

  yield* Console.log("Step 1: Migrating Courses...");
  yield* runCourseMigration;

  yield* Console.log("Step 2: Migrating Users...");
  yield* runUserMigration;

  yield* Console.log("Step 3: Migrating Reviews...");
  yield* runReviewMigration;

  yield* Console.log("All Migrations Completed Successfully!");
}).pipe(
  Effect.catchAll((error) => Console.error("Migration Failed :", error)),
  Effect.provide(PrismaLive),
);

await Effect.runPromise(mainMigrationProgram);
