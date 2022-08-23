import { Semester, StudyProgram } from '@thinc-org/chula-courses'

export enum ReviewInteractionType {
  Like = 'L',
  Dislike = 'D',
}

export enum ReviewStatus {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Pending = 'PENDING',
}

export interface Review {
  _id: string
  rating: number
  courseNo: string
  semester: Semester
  academicYear: string
  studyProgram: StudyProgram
  content: string
  likeCount: number
  dislikeCount: number
  myInteraction: ReviewInteractionType | null
  status: ReviewStatus
  isOwner: boolean
}
