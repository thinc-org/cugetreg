import { useQuery } from '@apollo/client'
import { Stack, Typography } from '@mui/material'

import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import {
  GetMyPendingReviewsResponse,
  GetMyPendingReviewsVars,
  GET_MY_PENDING_REVIEWS,
} from '@/services/apollo/query/getMyPendingReview'
import { GetReviewsResponse, GetReviewsVars, GET_REVIEWS } from '@/services/apollo/query/getReviews'

import { ReviewCard } from '../ReviewCard'
import { ReviewListProps } from './types'

export const ReviewList: React.FC<ReviewListProps> = ({ course }) => {
  const { studyProgram } = useCourseGroup()

  const reviewQuery = useQuery<GetReviewsResponse, GetReviewsVars>(GET_REVIEWS, {
    variables: {
      courseNo: course.courseNo,
      studyProgram: studyProgram,
    },
  })

  const myPendingReviewQuery = useQuery<GetMyPendingReviewsResponse, GetMyPendingReviewsVars>(GET_MY_PENDING_REVIEWS, {
    variables: {
      courseNo: course.courseNo,
      studyProgram: studyProgram,
    },
  })

  console.log(myPendingReviewQuery)

  return (
    <Stack spacing={2}>
      <Typography variant="h4" mt={2}>
        ความคิดเห็น
      </Typography>
      {myPendingReviewQuery.data?.myPendingReviews.map((review) => (
        <ReviewCard key={review._id} {...review} />
      ))}
      {reviewQuery.data?.reviews.map((review) => (
        <ReviewCard key={review._id} {...review} />
      ))}
    </Stack>
  )
}
