import { Document, Schema, Types } from 'mongoose'

import { GenEdType, StudyProgram, genEdTypes, studyPrograms } from './types'

export const OverrideSchema = new Schema({
  courseNo: { type: String, required: true },
  studyProgram: { type: String, required: true, enum: studyPrograms },
  semester: { type: String, required: true },
  academicYear: { type: String, required: true },
  genEd: {
    genEdType: {
      type: String,
      required: true,
      enum: genEdTypes,
    },
    sections: { type: [String], required: true },
  },
})

export interface Override {
  courseNo: string
  studyProgram: StudyProgram
  semester: string
  academicYear: string
  genEd?: {
    genEdType: GenEdType
    sections: string[]
  }
}

export type OverrideDocument = Document<Types.ObjectId, unknown, Override> & Override
