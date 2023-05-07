import { Schema } from 'mongoose'

import {
  ClassType,
  DayOfWeek,
  GenEdType,
  Semester,
  StudyProgram,
  classTypes,
  dayOfWeeks,
  genEdTypes,
  semesters,
  studyPrograms,
} from './types'

export interface Period {
  start: string
  end: string
}

export interface ExamPeriod {
  date: string
  period: Period
}

export interface Section {
  sectionNo: string
  closed: boolean
  capacity: {
    current: number
    max: number
  }
  note?: string
  classes: {
    type: ClassType
    dayOfWeek?: DayOfWeek
    period?: Period
    building?: string
    room?: string
    teachers: string[]
  }[]
  genEdType: GenEdType
}

export interface Course {
  studyProgram: StudyProgram
  semester: Semester
  academicYear: string
  courseNo: string
  courseDescTh?: string
  courseDescEn?: string
  abbrName: string
  courseNameTh: string
  courseNameEn: string
  faculty: string
  department: string
  credit: number
  creditHours: string
  courseCondition: string
  genEdType: GenEdType
  rating?: string
  midterm?: ExamPeriod
  final?: ExamPeriod
  sections: Section[]
}

const period = {
  start: { type: String, required: true },
  end: { type: String, required: true },
}

const examPeriod = {
  date: { type: String, required: true },
  period: period,
}

const classSchema = {
  type: {
    type: String,
    required: true,
    enum: classTypes,
  },
  dayOfWeek: {
    type: String,
    required: true,
    enum: dayOfWeeks,
  },
  period: period,
  building: { type: String },
  room: { type: String },
  teachers: { type: [String], required: true },
}

const section = {
  sectionNo: { type: String, required: true },
  closed: { type: Boolean, required: true },
  capacity: {
    current: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  note: { type: String },
  classes: { type: [classSchema], required: true },
  genEdType: {
    type: String,
    required: true,
    enum: genEdTypes,
  },
}

export const CourseSchema = new Schema({
  studyProgram: { type: String, required: true, enum: studyPrograms },
  semester: { type: String, required: true, enum: semesters },
  academicYear: { type: String, required: true },
  courseNo: { type: String, required: true },
  abbrName: { type: String, required: true },
  courseNameTh: { type: String, required: true },
  courseNameEn: { type: String, required: true },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  credit: { type: Number, required: true },
  creditHours: { type: String, required: true },
  courseCondition: { type: String, required: true },
  genEdType: {
    type: String,
    required: true,
    enum: genEdTypes,
  },
  midterm: examPeriod,
  final: examPeriod,
  sections: { type: [section], required: true },
  rating: { type: String },
})

CourseSchema.index({ studyProgram: 1, academicYear: 1, semester: 1, courseNo: 1 })
CourseSchema.index({ studyProgram: 1, academicYear: 1, semester: 1, abbrName: 1 })
