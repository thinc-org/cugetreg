import { Effect } from "effect";
import * as R from "remeda";

import type { Course, CourseOverride } from "./migrate_interface.js";
import { migrateCourse, safeFsJsonRead } from "./migrate_service.js";

import { GenEdType } from "../src/generated/prisma/client.js";
import { mapGenEdType } from "../src/utils/enumMapper.js";

export const runCourseMigration = Effect.gen(function* () {
  const overridesData =
    yield* safeFsJsonRead<CourseOverride[]>("overrides.json");

  const coursesData = yield* safeFsJsonRead<Course[]>("courses.json");

  const genEdOverrideByCourseNo = R.pipe(
    overridesData,
    R.indexBy((item) => item.courseNo),
    R.mapValues((value) => mapGenEdType(value.genEdType)),
  );

  console.log(`Starting migration of ${coursesData.length} courses`);

  const migrationProgram = yield* Effect.forEach(
    coursesData,
    (data) => {
      const currentGenEd =
        genEdOverrideByCourseNo[data.courseNo] || GenEdType.NO;
      return migrateCourse(data, currentGenEd);
    },
    { discard: true, concurrency: 100 },
  );
});
