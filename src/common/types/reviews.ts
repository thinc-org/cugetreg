import { Semester, StudyProgram } from '@thinc-org/chula-courses'

export enum Interaction {
  Like = 'L',
  Dislike = 'D',
}

export interface Review {
  courseNo: string
  semester: Semester
  academicYear: string
  studyProgram: StudyProgram
  content: string
  likeCount: number
  dislikeCount: number
  myInteraction: Interaction
}
