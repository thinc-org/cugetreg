import { Stack, Typography } from '@mui/material'
import { useContext } from 'react'

import { ReviewContext } from '@/modules/CourseDetail/context/Review'

import { ReviewCard } from '../ReviewCard'

export const ReviewList: React.FC = () => {
  const { myPendingReviews, reviews } = useContext(ReviewContext)
  const hasReviews = reviews.length > 0 || myPendingReviews.length > 0

  if (!hasReviews) return null

  return (
    <Stack spacing={2}>
      <Typography variant="h4" mt={2}>
        ความคิดเห็น
      </Typography>
      {myPendingReviews.map((review) => (
        <ReviewCard key={review._id} {...review} pending />
      ))}
      {reviews.map((review) => (
        <ReviewCard key={review._id} {...review} />
      ))}
    </Stack>
  )
}
