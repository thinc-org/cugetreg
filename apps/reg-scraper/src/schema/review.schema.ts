import { StudyProgram } from '@thinc-org/chula-courses'
import * as mongoose from 'mongoose'

export const InteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  type: { type: String, required: true, enum: ['L', 'D'] },
})

export const ReviewSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  courseNo: { type: String, required: true },
  semester: { type: String, required: true },
  academicYear: { type: String, required: true },
  studyProgram: { type: String, required: true },
  rating: { type: Number, required: true },
  content: { type: String },
  interactions: [InteractionSchema],
  status: { type: String, default: 'PENDING' },
})

export type ReviewInteractionType = 'L' | 'D'
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'HIDDEN'

export interface ReviewInteraction {
  userId: mongoose.Types.ObjectId
  type: ReviewInteractionType
}

export type ReviewInteractionDocument = ReviewInteraction & mongoose.Document

export interface Review {
  ownerId: mongoose.Types.ObjectId
  rating: number
  courseNo: string
  semester: string
  academicYear: string
  studyProgram: StudyProgram
  content?: string
  interactions: mongoose.Types.DocumentArray<ReviewInteractionDocument>
  status: ReviewStatus
}

export type ReviewDocument = Review & mongoose.Document
