import { GenEdType } from "../src/generated/prisma/client.js";
import * as fs from "fs";
import * as R from "remeda";
import { Effect } from "effect";
import { mapGenEdType } from "../src/utils/enumMapper.js";
import { migrateCourse, safeFsJsonRead } from "./migrate_service.js";
import type { Course, CourseOverride } from "./migrate_interface.js";

export const runCourseMigration = Effect.gen(function* () {
  const overridesData = yield* safeFsJsonRead<CourseOverride[]>(
    "overrides.json"
  );

  const coursesData = yield* safeFsJsonRead<Course[]>("courses.json");

  const genEdOverrideByCourseNo = R.pipe(
    overridesData,
    R.indexBy((item) => item.courseNo),
    R.mapValues((value) => mapGenEdType(value.genEdType))
  );

  console.log(`Starting migration of ${coursesData.length} courses`);

  const migrationProgram = yield* Effect.forEach(
    coursesData,
    (data) => {
      const currentGenEd =
        genEdOverrideByCourseNo[data.courseNo] || GenEdType.NOT_GENED;
      return migrateCourse(data, currentGenEd);
    },
    { discard: true, concurrency: 50 }
  );
});
