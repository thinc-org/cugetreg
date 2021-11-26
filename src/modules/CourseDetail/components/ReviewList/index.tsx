import { Stack, Typography } from '@mui/material'
import { SemesterEnum } from '@thinc-org/chula-courses'

import { ReviewCard } from '../ReviewCard'
import { ReviewCardProps } from '../ReviewCard/types'
import { ReviewListProps } from './types'

const mockReviews: ReviewCardProps[] = [
  {
    academicYear: '2563',
    semester: '1' as SemesterEnum,
    content:
      'มากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมาย',
    like: 10,
    dislike: 20,
    rating: 5,
    pending: true,
  },
  {
    academicYear: '2563',
    semester: '1' as SemesterEnum,
    content:
      'มากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมาย',
    like: 10,
    dislike: 20,
    rating: 5,
  },
]

export const ReviewList: React.FC<ReviewListProps> = ({ course }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h4" mt={2}>
        ความคิดเห็น
      </Typography>
      {mockReviews.map((props, index) => (
        <ReviewCard key={course.abbrName + index} {...props} />
      ))}
    </Stack>
  )
}
