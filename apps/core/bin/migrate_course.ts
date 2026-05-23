import cliProgress from "cli-progress";
import * as R from "remeda";

import type { Course, CourseOverride } from "./migrate_interface.js";
import {
  migrateCourse,
  runConcurrent,
  safeFsJsonRead,
} from "./migrate_service.js";

import { GenEdType } from "../src/generated/prisma/client.js";
import { mapGenEdType } from "../src/utils/enumMapper.js";

const CONCURRENCY = 50;

export async function runCourseMigration() {
  const overridesData = safeFsJsonRead<CourseOverride[]>("overrides.json");
  const coursesData = safeFsJsonRead<Course[]>("courses.json");

  const genEdOverrideByCourseNo = R.pipe(
    overridesData,
    R.indexBy((item) => item.courseNo),
    R.mapValues((value) => mapGenEdType(value.genEdType)),
  );

  const bar = new cliProgress.SingleBar(
    { format: "  Courses  [{bar}] {value}/{total} ({percentage}%)" },
    cliProgress.Presets.shades_classic,
  );
  bar.start(coursesData.length, 0);

  await runConcurrent(coursesData, CONCURRENCY, async (data) => {
    const currentGenEd = genEdOverrideByCourseNo[data.courseNo] || GenEdType.NO;
    await migrateCourse(data, currentGenEd);
    bar.increment();
  });

  bar.stop();
}
