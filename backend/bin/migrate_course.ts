import { GenEdType, PrismaClient } from "../src/generated/prisma/client.js"; // ปรับ path ตาม output prisma
import { Decimal } from "decimal.js";
import * as fs from "fs";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  mapDayOfWeek,
  mapGenEdType,
  mapSemester,
  mapStudyProgram,
} from "./enumMapper.js";

const adapter = new PrismaPg({
  connectionString:
    "postgresql://admin:cugetreg@localhost:5432/cugetreg?schema=public",
});
const prisma = new PrismaClient({ adapter });

function parseExamDate(
  dateStr: string | undefined,
  timeStr: string | undefined
): Date | null {
  if (!dateStr || !timeStr) return null;
  const date = new Date(dateStr);
  if (date.getFullYear() > 2400) {
    date.setFullYear(date.getFullYear() - 543);
  }
  const [hours, minutes] = timeStr.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

async function migrate() {
  const overridesRaw = fs.readFileSync("overrides.json", "utf-8");
  const overridesData = JSON.parse(overridesRaw);
  const genEdOverrideMap = new Map<string, GenEdType>();

  overridesData.forEach((item: any) => {
    genEdOverrideMap.set(item.courseNo, mapGenEdType(item.genEdType));
  });

  const rawData = fs.readFileSync("courses.json", "utf-8");
  const coursesData = JSON.parse(rawData);

  console.log(`Starting migration of ${coursesData.length} courses...`);

  for (const data of coursesData) {
    try {
      const currentGenEd =
        genEdOverrideMap.get(data.courseNo) || GenEdType.NOT_GENED;

      await prisma.courseInfo.upsert({
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
          faculty: data.faculty,
          department: data.department,
          credit: new Decimal(data.credit),
          creditHours: data.creditHours,
        },
      });

      const course = await prisma.course.create({
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
          finalEnd: parseExamDate(data.final?.date, data.final?.period?.end),
          genEdType: currentGenEd,
          sections: {
            create: data.sections.map((sec: any) => ({
              sectionNo: parseInt(sec.sectionNo),
              closed: sec.closed,
              regis: sec.capacity.current,
              max: sec.capacity.max,
              note: sec.note,
              genEdType: currentGenEd,
              classes: {
                create: sec.classes.map((cls: any) => ({
                  type: cls.type,
                  dayOfWeek: mapDayOfWeek(cls.dayOfWeek),
                  periodStart: cls.period.start,
                  periodEnd: cls.period.end,
                  building: cls.building,
                  room: cls.room,
                  professors: cls.teachers.join(","),
                })),
              },
            })),
          },
        },
      });

      console.log(
        `Successfully migrated: ${data.courseNo} (GenEd: ${currentGenEd})`
      );
    } catch (error) {
      console.error(`Error migrating ${data.courseNo}:`, error);
    }
  }
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
