import { createId } from '@paralleldrive/cuid2'
import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

export const semester = pgEnum('semester', ['1', '2', '3'])
export const studyProgram = pgEnum('study_program', ['S', 'T', 'I'])
export const genEdType = pgEnum('gen_ed_type', ['NO', 'SC', 'SO', 'HU', 'IN'])

export const course = pgTable(
  'course',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),

    studyProgram: studyProgram('study_program').notNull(),
    academicYear: integer('academic_year').notNull(),
    semester: semester('semester').notNull(),

    courseNo: text('course_no').notNull(),
    abbrName: text('abbr_name').notNull(),
    courseNameEn: text('course_name_en').notNull(),
    courseNameTh: text('course_name_th').notNull(),

    // Not from Reg Chula
    courseDescEn: text('course_desc_en'),
    courseDescTh: text('course_desc_th'),
    // Not from Reg Chula

    faculty: text('faculty').notNull(),
    department: text('department').notNull(),

    credit: real('credit').notNull(),
    creditHours: text('credit_hours').notNull(),

    courseCondition: text('course_condition'),

    midtermStart: timestamp('midterm_start'),
    midtermEnd: timestamp('midterm_end'),
    finalStart: timestamp('final_start'),
    finalEnd: timestamp('final_end'),

    // sections: In sections table

    // From GenEd Database
    genEdType: genEdType('gen_ed_type').notNull().default('NO'),

    // CU Get Reg's User Data
    rating: doublePrecision('rating'),

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

export const section = pgTable(
  'course_section',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    courseId: text('course_id')
      .notNull()
      .references(() => course.id),

    courseNo: text('course_no').notNull(),

    sectionNo: integer('section_no').notNull(),
    closed: boolean('closed').notNull(),

    regis: integer('regis').notNull(),
    max: integer('max').notNull(),

    note: text('note'),
  },
  (t) => ({
    sectionUnique: unique('section_unique').on(
      t.courseId,
      t.courseNo,
      t.sectionNo,
    ),
  }),
)

export const dayOfWeek = pgEnum('day_of_week', [
  'MO',
  'TU',
  'WE',
  'TH',
  'FR',
  'SA',
  'SU',
])

// TODO Add constraint
export const sectionClass = pgTable('course_class', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  sectionId: text('section_id')
    .notNull()
    .references(() => section.id),

  type: text('type').notNull(),

  dayOfWeek: dayOfWeek('day_of_week'),
  periodStart: text('period_start'),
  periodEnd: text('period_end'),

  building: text('building'),
  room: text('room'),

  professors: text('professors').array(),
})
