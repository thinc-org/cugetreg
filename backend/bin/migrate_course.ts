import { GenEdType, PrismaClient } from "../src/generated/prisma/client.js";
import * as fs from "fs";
import dotenv from "dotenv";
import { Decimal } from "decimal.js";
import dayjs from "dayjs";
import * as R from "ramda";
import { Effect, Console } from "effect";

dotenv.config();

import { PrismaPg } from "@prisma/adapter-pg";
import {
  mapDayOfWeek,
  mapGenEdType,
  mapSemester,
  mapStudyProgram,
} from "../src/utils/enumMapper.js";

const adapter = new PrismaPg({
  connectionString:
    "postgresql://admin:cugetreg@localhost:5432/cugetreg?schema=public",
  max: 10,
});
const prisma = new PrismaClient({ adapter });

function parseExamDate(
  dateStr: string | undefined,
  timeStr: string | undefined
) {
  if (!dateStr || !timeStr) return null;
  let d = dayjs(dateStr);
  if (d.year() > 2400) {
    d = d.subtract(543, "year");
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  return d.startOf("day").add(hours, "hours").add(minutes, "minutes").toDate();
}

const safeParseJSON = <T>(jsonString: string) =>
  Effect.try({
    try: () => JSON.parse(jsonString) as T,
    catch: (e) => new Error(`JSON parsing failed: ${e}`),
  });

interface MongoDate {
  $date: string;
}

interface MongoId {
  $oid: string;
}

interface Period {
  start: string; // e.g. "13:30"
  end: string;
}

interface ExamInfo {
  period: Period;
  date: string; // pass to parseExamDate
}

interface ClassInfo {
  _id: MongoId;
  type: string;
  dayOfWeek: string;
  period: Period;
  building?: string;
  room?: string;
  teachers: string[];
}

interface Section {
  _id: MongoId;
  sectionNo: string;
  closed: boolean;
  capacity: {
    current: number;
    max: number;
  };
  note?: string;
  classes: ClassInfo[];
  genEdType: string;
}

interface Course {
  _id: MongoId;
  courseNo: string;
  abbrName: string;
  courseNameTh: string;
  courseNameEn: string;
  courseDescTh?: string;
  courseDescEn?: string;
  courseCondition?: string;
  academicYear: string;
  semester: string;
  credit: number;
  creditHours?: string;
  department?: string;
  faculty?: string;
  genEdType: string;
  studyProgram: string;
  sections: Section[];
  midterm?: ExamInfo;
  final?: ExamInfo;
  updatedAt: MongoDate;
  createdAt?: MongoDate;
  rating?: string;
}

interface CourseOverride {
  _id: MongoId;
  courseNo: string;
  genEdType: string;
}

const migrateCourse = (data: Course, currentGenEd: GenEdType) =>
  Effect.gen(function* (_) {
    yield* _(
      Effect.tryPromise({
        try: () =>
          prisma.courseInfo.upsert({
            where: { courseNo: data.courseNo },
            update: {
              abbrName: data.abbrName,
              courseNameEn: data.courseNameEn,
              courseNameTh: data.courseNameTh,
              courseDescEn: data.courseDescEn,
              courseDescTh: data.courseDescTh,
            },
            create: {
              courseNo: data.courseNo,
              abbrName: data.abbrName,
              courseNameEn: data.courseNameEn,
              courseNameTh: data.courseNameTh,
              courseDescEn: data.courseDescEn,
              courseDescTh: data.courseDescTh,
              faculty: data.faculty || "",
              department: data.department || "",
              credit: new Decimal(data.credit),
              creditHours: data.creditHours || "",
            },
          }),
        catch: (e) => new Error(`Prisma CourseInfo Error: ${e}`),
      })
    );

    yield* _(
      Effect.tryPromise({
        try: () =>
          prisma.course.create({
            data: {
              courseNo: data.courseNo,
              academicYear: parseInt(data.academicYear),
              semester: mapSemester(data.semester),
              studyProgram: mapStudyProgram(data.studyProgram),
              courseCondition: data.courseCondition,
              midtermStart: parseExamDate(
                data.midterm?.date,
                data.midterm?.period?.start
              ),
              midtermEnd: parseExamDate(
                data.midterm?.date,
                data.midterm?.period?.end
              ),
              finalStart: parseExamDate(
                data.final?.date,
                data.final?.period?.start
              ),
              finalEnd: parseExamDate(
                data.final?.date,
                data.final?.period?.end
              ),
              genEdType: currentGenEd,
              sections: {
                create: data.sections.map((sec) => ({
                  sectionNo: parseInt(sec.sectionNo),
                  closed: sec.closed,
                  regis: sec.capacity.current,
                  max: sec.capacity.max,
                  note: sec.note,
                  genEdType: currentGenEd,
                  classes: {
                    create: sec.classes.map((cls) => ({
                      type: cls.type,
                      dayOfWeek: mapDayOfWeek(cls.dayOfWeek),
                      periodStart: cls.period.start,
                      periodEnd: cls.period.end,
                      building: cls.building,
                      room: cls.room,
                      professors: cls.teachers,
                    })),
                  },
                })),
              },
            },
          }),
        catch: (e) => new Error(`Prisma Course Create Error: ${e}`),
      })
    );

    yield* _(Console.log(`Successfully migrated: ${data.courseNo}`));
  }).pipe(
    Effect.catchAll((err) =>
      Console.error(`Skipping ${data.courseNo}: ${err.message}`)
    )
  );

async function migrate() {
  const overridesRaw: string = fs.readFileSync("overrides.json", "utf-8");
  const overridesData = Effect.runSync(
    safeParseJSON<CourseOverride[]>(overridesRaw)
  );

  const indexedOverrides = R.indexBy(
    (item: CourseOverride) => item.courseNo,
    overridesData
  );
  const genEdOverrideLookup = R.map(
    (item: CourseOverride) => mapGenEdType(item.genEdType),
    indexedOverrides
  );

  const rawData: string = fs.readFileSync("courses.json", "utf-8");
  const coursesData = Effect.runSync(safeParseJSON<Course[]>(rawData));

  console.log(`Starting migration of ${coursesData.length} courses`);

  const migrationProgram = Effect.forEach(
    coursesData,
    (data) => {
      const currentGenEd =
        genEdOverrideLookup[data.courseNo] || GenEdType.NOT_GENED;
      return migrateCourse(data, currentGenEd);
    },
    { discard: true, concurrency: 5 }
  );

  await Effect.runPromise(migrationProgram);
}

migrate()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Migration completed.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
