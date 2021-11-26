import { useQuery } from '@apollo/client'
import { Stack, Typography } from '@mui/material'

import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { ReviewInteraction } from '@/common/types/reviews'
import { GetReviewsResponse, GetReviewsVars, GET_REVIEWS } from '@/services/apollo/query/getReviews'

import { ReviewCard } from '../ReviewCard'
import { ReviewCardProps } from '../ReviewCard/types'
import { ReviewListProps } from './types'

const mockReviews: ReviewCardProps[] = [
  {
    rating: 5,
    courseNo: 'CUG-100',
    semester: '1',
    academicYear: '2563',
    studyProgram: 'S',
    content:
      'มากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมาย',
    likeCount: 10,
    dislikeCount: 20,
    pending: true,
    myInteraction: ReviewInteraction.Like,
  },
  {
    rating: 5,
    courseNo: 'CUG-100',
    semester: '1',
    academicYear: '2563',
    studyProgram: 'S',
    content:
      'มากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมายมากมาย',
    likeCount: 10,
    dislikeCount: 20,
    myInteraction: ReviewInteraction.Like,
  },
]

export const ReviewList: React.FC<ReviewListProps> = ({ course }) => {
  const { studyProgram } = useCourseGroup()

  const reviewQuery = useQuery<GetReviewsResponse, GetReviewsVars>(GET_REVIEWS, {
    variables: {
      courseNo: course.courseNo,
      studyProgram: studyProgram,
    },
  })

  return (
    <Stack spacing={2}>
      <Typography variant="h4" mt={2}>
        ความคิดเห็น
      </Typography>
      {reviewQuery.data?.reviews.map((review, index) => (
        <ReviewCard key={course.abbrName + index} {...review} />
      ))}
      {mockReviews.map((props, index) => (
        <ReviewCard key={course.abbrName + index} {...props} />
      ))}
    </Stack>
  )
}
