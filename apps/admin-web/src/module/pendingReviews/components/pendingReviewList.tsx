import { Button, Container, Stack, Typography } from '@mui/material'

import { useGetPendingReviewsLazyQuery, useGetPendingReviewsQuery } from '@cgr/codegen'

import SinglePendingReview from './singlePendingReview'

export default function PendingReviewsList() {
  const { data, loading, refetch: refetchReviews } = useGetPendingReviewsQuery()
  const [loadMore, { data: lazyData, loading: lazyLoading, error: lazyError, refetch }] =
    useGetPendingReviewsLazyQuery()
  return (
    <>
      <Container disableGutters>
        {/* {loading
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
            ))} */}
        loadMore()
        {lazyData?.pendingReviews.map((data) => (
          <SinglePendingReview key={data._id} data={data} refetchReviews={refetch} />
        ))}
        <Stack alignItems={'center'} paddingBottom={2}>
          <Button variant="contained" onClick={() => loadMore()}>
            <Typography>Load more</Typography>
          </Button>
        </Stack>
      </Container>
    </>
  )
}
