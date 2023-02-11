import { useGetPendingReviewsQuery } from '@cgr/codegen'
import { Container, Typography } from '@mui/material'
import SinglePendingReview from './singlePendingReview'

export default function PendingReviewsList() {
  const reviewQuery = useGetPendingReviewsQuery()
  return (
    <>
      <Container>
        <Typography variant="h3" align="center">
          Reviews
        </Typography>
        {reviewQuery.data?.pendingReviews.map((data) => (
          <SinglePendingReview data={data} />
        ))}
      </Container>
    </>
  )
}
