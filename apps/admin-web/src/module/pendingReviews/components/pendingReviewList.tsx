import { useGetPendingReviewsQuery } from '@cgr/codegen'
import { Container, Skeleton, Typography, Grid } from '@mui/material'
import SinglePendingReview from './singlePendingReview'

export default function PendingReviewsList() {
  const reviewQuery = useGetPendingReviewsQuery()

  return (
    <>
      <Container>
        <Typography variant="h3" align="center">
          Reviews
        </Typography>
        {reviewQuery.loading ? (
          // Todo: Reduce gaps between each skeleton
          // Todo: Add more skeleton (dynamically?)
          <Grid spacing={0} direction="column">
            <Skeleton height={200} />
            <Skeleton height={200} />
            <Skeleton height={200} />
          </Grid>
        ) : (
          reviewQuery.data?.pendingReviews.map((data) => <SinglePendingReview data={data} />)
        )}
      </Container>
    </>
  )
}
