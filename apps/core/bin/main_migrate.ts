import "dotenv/config";

import { runCourseMigration } from "./migrate_course.js";
import { runReviewMigration } from "./migrate_review.js";
import { runUserMigration } from "./migrate_user.js";

try {
  console.log("Starting All Migration Process...");

  console.log("Step 1: Migrating Courses...");
  await runCourseMigration();

  console.log("Step 2: Migrating Users...");
  await runUserMigration();

  console.log("Step 3: Migrating Reviews...");
  await runReviewMigration();

  console.log("All Migrations Completed Successfully!");
} catch (error) {
  console.error("Migration Failed:", error);
  process.exit(1);
}
