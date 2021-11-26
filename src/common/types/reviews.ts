import { Semester, StudyProgram } from '@thinc-org/chula-courses'

export enum ReviewInteraction {
  Like = 'L',
  Dislike = 'D',
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
  myInteraction: ReviewInteraction
}
