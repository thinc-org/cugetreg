import { Button, Container } from '@mui/material'

import { useGetPendingReviewsQuery } from '@cgr/codegen'

import SinglePendingReview from './singlePendingReview'

export default function PendingReviewsList() {
  const { data, loading, refetch: refetchReviews } = useGetPendingReviewsQuery()

  return (
    <>
      <Container disableGutters>
        {loading
          ? // Todo: Reduce gaps between each skeleton
            // Todo: Add more skeleton (dynamically?)
            // <Grid spacing={0} direction="column">
            //   <Skeleton height={200} />
            //   <Skeleton height={200} />
            //   <Skeleton height={200} />
            // </Grid>
            // TODO: THiS Cause ERROR
            null
          : data?.pendingReviews.map((data) => (
              <SinglePendingReview key={data._id} data={data} refetchReviews={refetchReviews} />
            ))}
      </Container>
    </>
  )
}
