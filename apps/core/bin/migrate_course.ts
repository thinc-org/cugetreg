import * as R from "remeda";

import type { Course, CourseOverride } from "./migrate_interface.js";
import { migrateCourse, safeFsJsonRead } from "./migrate_service.js";

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

  console.log(`Starting migration of ${coursesData.length} courses`);

  await Promise.all(
    coursesData.map((data) => {
      const currentGenEd =
        genEdOverrideByCourseNo[data.courseNo] || GenEdType.NO;
      return migrateCourse(data, currentGenEd);
    }),
  );
}
