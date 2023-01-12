import { ReviewInteractionType, StudyProgram } from '@libs/codegen'

export enum ReviewStatus {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Pending = 'PENDING',
}

export interface Review {
  _id: string
  rating: number
  courseNo: string
  /**
   * TODO: In order to type `Semester` we need breaking backend changes
   */
  semester: string
  // semester: Semester
  academicYear: string
  studyProgram: StudyProgram
  content?: string
  likeCount: number
  dislikeCount: number
  myInteraction?: ReviewInteractionType
  status?: ReviewStatus
  rejectionReason?: string
  isOwner: boolean
}