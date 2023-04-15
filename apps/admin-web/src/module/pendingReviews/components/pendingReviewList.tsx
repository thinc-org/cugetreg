import { useEffect } from 'react'

import { Button, Container, Stack, Typography } from '@mui/material'

import { useGetPendingReviewsLazyQuery } from '@cgr/codegen'

import SinglePendingReview from './singlePendingReview'

interface PendingReviewListProps {
  year: string
  semester: string
}

export default function PendingReviewsList({
  year: year,
  semester: semester,
}: PendingReviewListProps) {
  const [loadMore, { data: lazyData, refetch, called }] = useGetPendingReviewsLazyQuery()

  useEffect(() => {
    if (!called) {
      loadMore()
    }
    console.log(year)
    console.log(semester)
  }, [called, loadMore, year, semester])

  return (
    <>
      <Container disableGutters>
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
