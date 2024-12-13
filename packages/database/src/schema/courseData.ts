import { createId } from '@paralleldrive/cuid2'
import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

import { dayOfWeek, genEdType, semester, studyProgram } from './types.js'

/**
 * https://datagateway.chula.ac.th (Connect to Chula Wi-Fi)
 * DG0206 (ALL CAPS stuff) -> Each row of section class (1NF?)
 * DG0403 (snake_case stuff) -> Course Data Only
 * DG0216 For Professors Reference
 */
export const course = pgTable(
  'course',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    // 19 STUDYPROGRAMSYSTEM
    studyProgram: studyProgram('study_program').notNull(),
    // 1 YEAR
    academicYear: integer('academic_year').notNull(),
    // 2 SEMESTER
    semester: semester('semester').notNull(),

    // 3 COURSECODE / 11 courseno
    courseNo: text('course_no')
      .notNull()
      .references(() => courseInfo.courseNo),

    // ! not available in data gateway
    courseCondition: text('course_condition'),

    // ! not available in data gateway
    midtermStart: timestamp('midterm_start'),
    midtermEnd: timestamp('midterm_end'),
    finalStart: timestamp('final_start'),
    finalEnd: timestamp('final_end'),

    // sections for this course: In sections table

    // From section rows OR from gened override?
    genEdType: genEdType('gen_ed_type').notNull().default('NO'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    courseUnique: unique('course_unique').on(
      t.studyProgram,
      t.academicYear,
      t.semester,
      t.courseNo,
    ),
  }),
)

export const courseInfo = pgTable('course_info', {
  courseNo: text('course_no').primaryKey(),

  // 4 COURSENAME
  abbrName: text('abbr_name').notNull(),

  // 14 coursename_en
  courseNameEn: text('course_name_en').notNull(),
  // 13 coursename_th
  courseNameTh: text('course_name_th').notNull(),

  // 23 coursedescription_en
  courseDescEn: text('course_desc_en'),
  // 22 coursedescription_th
  courseDescTh: text('course_desc_th'),

  // TODO separate this into other table
  // indirect -> 30 FACCODE or From CourseNo (Transitive Dependency)
  faculty: text('faculty').notNull(),
  // indirect -> From CourseNo (Transitive Dependency)
  department: text('department').notNull(),

  // 24 TOTALCREDIT
  credit: decimal('credit').notNull(),
  // Must build from 17 lcredit 18 nlcredit 19 lhour 20 nlhour 21 shour
  creditHours: text('credit_hours').notNull(),
})

export const section = pgTable(
  'course_section',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    courseId: text('course_id')
      .notNull()
      .references(() => course.id),

    // 5 SECTION
    sectionNo: integer('section_no').notNull(),
    // ! Might not available in Data Gateway
    closed: boolean('closed').notNull(),

    // 25 REALREG
    regis: integer('regis').notNull(),
    // 26 TOTALREG
    max: integer('max').notNull(),

    // 27 REMARK1 & 28 REMARK2 & 29 REMARK3
    note: text('note'),
    // 20 GENEDSTATUS & 21 GENERALSUBJECT
    genEdType: genEdType('gen_ed_type').notNull().default('NO'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    sectionUnique: unique('section_unique').on(t.courseId, t.sectionNo),
  }),
)

export const sectionClass = pgTable('course_class', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  sectionId: text('section_id')
    .notNull()
    .references(() => section.id),

  // 7 TEACHTYPE
  type: text('type').notNull(),

  // 8 DAY1 & 9 DAY2 & ... & 14 DAY7
  // * Note: DG use Multi-Valued, we will flatten it in our database
  dayOfWeek: dayOfWeek('day_of_week').notNull(),
  // 15 STARTTIME
  periodStart: text('period_start').notNull(),
  // 16 ENDTIME
  periodEnd: text('period_end').notNull(),

  // 17 BUILDING
  building: text('building'),
  // 18 ROOM
  room: text('room'),

  // DG0216 -> FK(???) 16 NAME_ABBR
  professors: text('professors').array(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})
