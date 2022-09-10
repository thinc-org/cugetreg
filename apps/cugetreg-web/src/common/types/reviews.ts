import { ReviewInteractionType } from '@cugetreg/codegen'
import { StudyProgram } from '@cugetreg/codegen'

export { ReviewInteractionType } from '@cugetreg/codegen'

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
   * TODO: If we want to use typed `Semester` (`"1" | "2" | "3"`),
   * we need to convert our graphql types in backend too!
   * */
  semester: string
  // semester: Semester
  academicYear: string
  studyProgram: StudyProgram
  content?: string
  likeCount: number
  dislikeCount: number
  myInteraction?: ReviewInteractionType
  status?: ReviewStatus
  isOwner: boolean
}
