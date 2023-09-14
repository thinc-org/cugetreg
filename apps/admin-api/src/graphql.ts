/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export type DayOfWeek = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU' | 'IA' | 'AR'
export type StudyProgram = 'S' | 'T' | 'I'
export type GenEdType = 'SO' | 'HU' | 'SC' | 'IN' | 'NO'
export type ReviewInteractionType = 'L' | 'D'
export type ReviewStatus = 'APPROVED' | 'REJECTED' | 'PENDING'

export class OverrideInput {
  courseNo: string
  genEdType: GenEdType
}

export class CreateReviewInput {
  rating: number
  courseNo: string
  semester: string
  academicYear: string
  studyProgram: StudyProgram
  content?: Nullable<string>
}

export class EditReviewInput {
  rating?: Nullable<number>
  semester?: Nullable<string>
  academicYear?: Nullable<string>
  content?: Nullable<string>
}

export class Override {
  courseNo: string
  genEdType: GenEdType
}

export abstract class IQuery {
  abstract overrides(): Override[] | Promise<Override[]>

  abstract reviews(courseNo: string, studyProgram: StudyProgram): Review[] | Promise<Review[]>

  abstract myPendingReviews(
    courseNo: string,
    studyProgram: StudyProgram
  ): Review[] | Promise<Review[]>

  abstract pendingReviews(): Review[] | Promise<Review[]>
}

export abstract class IMutation {
  abstract createOrUpdateOverride(override: OverrideInput): Override | Promise<Override>

  abstract deleteOverride(courseNo: string): Nullable<Override> | Promise<Nullable<Override>>

  abstract createReview(createReviewInput: CreateReviewInput): Review | Promise<Review>

  abstract removeReview(reviewId: string): Review | Promise<Review>

  abstract editMyReview(reviewId: string, review: EditReviewInput): Review | Promise<Review>

  abstract setReviewInteraction(
    reviewId: string,
    interactionType: ReviewInteractionType
  ): Review | Promise<Review>

  abstract setReviewStatus(
    reviewId: string,
    status: ReviewStatus,
    rejectionReason?: Nullable<string>
  ): string | Promise<string>
}

export class Review {
  _id: string
  rating: number
  courseNo: string
  courseTitle: string
  semester: string
  academicYear: string
  studyProgram: StudyProgram
  content?: Nullable<string>
  likeCount: number
  dislikeCount: number
  myInteraction?: Nullable<ReviewInteractionType>
  status?: Nullable<ReviewStatus>
  rejectionReason?: Nullable<string>
  isOwner: boolean
}

type Nullable<T> = T | null
