import cliProgress from "cli-progress";
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

  // Step 1: bulk-insert all CourseInfo in one query
  process.stdout.write("  CourseInfo  inserting...");
  await bulkMigrateCourseInfo(coursesData);
  process.stdout.write(" done\n");

  // Step 2: find what's new, then batch-insert Course + Section + SectionClass
  const bar = new cliProgress.SingleBar(
    { format: "  Courses    [{bar}] {value}/{total} ({percentage}%)" },
    cliProgress.Presets.shades_classic,
  );
  bar.start(0, 0);

  const { created, skipped } = await bulkMigrateCoursesWithSections(
    coursesData,
    genEdOverrideByCourseNo as Record<string, GenEdType>,
    (done, total) => {
      bar.setTotal(total);
      bar.update(done);
    },
  );

  bar.stop();
  console.log(`  Created ${created} new courses, skipped ${skipped} existing`);
}
