import * as R from "remeda";

import type { Course, CourseOverride } from "./migrate_interface.js";
import {
  bulkMigrateCourseInfo,
  bulkMigrateCoursesWithSections,
  safeFsJsonRead,
} from "./migrate_service.js";

import { GenEdType } from "../src/generated/prisma/client.js";
import { mapGenEdType } from "../src/utils/enumMapper.js";

export async function runCourseMigration() {
  const overridesData = safeFsJsonRead<CourseOverride[]>("overrides.json");
  const coursesData = safeFsJsonRead<Course[]>("courses.json");

  const genEdOverrideByCourseNo = R.pipe(
    overridesData,
    R.indexBy((item) => item.courseNo),
    R.mapValues((value) => mapGenEdType(value.genEdType)),
  );

  console.log(`  Found ${coursesData.length} courses`);

  // Step 1: bulk-insert CourseInfo in batches of 5k
  const totalBatches = Math.ceil(coursesData.length / 5_000);
  for (let b = 0; b < totalBatches; b++) {
    process.stdout.write(
      `\r  CourseInfo  batch ${b + 1}/${totalBatches}...`,
    );
    await bulkMigrateCourseInfo(
      coursesData.slice(b * 5_000, (b + 1) * 5_000),
    );
  }
  process.stdout.write(`\r  CourseInfo  ✔ all ${coursesData.length} rows inserted\n`);

  // Step 2: courses → sections → classes via createManyAndReturn
  let lastStep = "";
  const { created, skipped } = await bulkMigrateCoursesWithSections(
    coursesData,
    genEdOverrideByCourseNo as Record<string, GenEdType>,
    (step, done, total) => {
      if (step !== lastStep) {
        if (lastStep) process.stdout.write("\n");
        lastStep = step;
      }
      const pct = total > 0 ? Math.round((done / total) * 100) : 100;
      process.stdout.write(
        `\r  ${step.padEnd(12)} ${String(done).padStart(7)}/${total} (${pct}%)`,
      );
    },
  );
  if (lastStep) process.stdout.write("\n");

  console.log(`  ✔ Created ${created} new courses, skipped ${skipped} existing`);
}
