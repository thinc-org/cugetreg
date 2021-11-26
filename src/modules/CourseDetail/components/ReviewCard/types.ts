import { SemesterEnum } from '@thinc-org/chula-courses'

export interface ReviewCardProps {
  semester: SemesterEnum
  academicYear: string
  content: string
  rating: number
  like: number
  dislike: number
  pending?: boolean
}
