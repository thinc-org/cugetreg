import { Schema, Types } from 'mongoose'

import { StudyProgram } from './types'

export const reviewInteractionTypes = ['L', 'D'] as const
export type ReviewInteractionType = (typeof reviewInteractionTypes)[number]

export const reviewStatuses = ['APPROVED', 'REJECTED', 'PENDING'] as const
export type ReviewStatus = (typeof reviewStatuses)[number]

export interface ReviewInteraction {
  userId: Types.ObjectId
  type: ReviewInteractionType
}

export interface Review {
  ownerId: Types.ObjectId
  rating: number
  courseNo: string
  semester: string
  academicYear: string
  studyProgram: StudyProgram
  content?: string
  interactions: Types.DocumentArray<ReviewInteraction> // TODO: change from document array to normal array?
  status: ReviewStatus
  rejectionReason?: string
}

// TODO: move away from subdocuments?
export const InteractionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  type: {
    type: String,
    required: true,
    enum: reviewInteractionTypes,
  },
})

export const ReviewSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
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
  status: {
    type: String,
    enum: reviewStatuses,
    default: 'PENDING',
  },
  rejectionReason: { type: String },
})

ReviewSchema.index({ studyProgram: 1, courseNo: 1 })
