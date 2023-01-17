import { Course } from '@thinc-org/chula-courses'
import * as mongoose from 'mongoose'

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
    enum: [
      'LECT',
      'LAB',
      'DISC',
      'FWK',
      'PRAC',
      'IDPS',
      'SMNA',
      'STU',
      'L/T',
      'IA',
      'OTHER',
      'IDVS',
      'AR',
      'CLIN',
      'TUT',
      'REFL',
    ],
  },
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['IA', 'AR', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
  },
  period: period,
  building: { type: String },
  room: { type: String },
  teachers: { type: [String], required: true },
}

const capacity = {
  current: { type: Number, required: true },
  max: { type: Number, required: true },
}

const section = {
  sectionNo: { type: String, required: true },
  closed: { type: Boolean, required: true },
  capacity: capacity,
  note: { type: String },
  classes: { type: [classSchema], required: true },
  genEdType: {
    type: String,
    required: true,
    enum: ['SC', 'SO', 'HU', 'IN', 'NO'],
  },
}

export const CourseSchema = new mongoose.Schema(
  {
    studyProgram: { type: String, required: true, enum: ['S', 'T', 'I'] },
    semester: { type: String, required: true, enum: ['1', '2', '3'] },
    academicYear: { type: String, required: true },
    courseNo: { type: String, required: true },
    courseDescTh: { type: String },
    courseDescEn: { type: String },
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
      enum: ['SC', 'SO', 'HU', 'IN', 'NO'],
    },
    midterm: examPeriod,
    final: examPeriod,
    sections: { type: [section], required: true },
    rating: { type: String },
  },
  {
    timestamps: true,
  }
)

export type CourseDocument = Course & mongoose.Document
