/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react'

import { Container } from '@mui/material'

import { useGetPendingReviewsLazyQuery } from '@cgr/codegen'

import Topbar from './components/Topbar'
import SinglePendingReview from './components/singlePendingReview'

export function PendingReviewsPage() {
  const [loadMore, { data: lazyData, refetch, called }] = useGetPendingReviewsLazyQuery()

  useEffect(() => {
    if (!called) {
      loadMore()
    }
  }, [called, loadMore])

  return (
    <div>
      <Topbar />
      <Container disableGutters>
        {lazyData?.pendingReviews.map((data) => (
          <SinglePendingReview key={data._id} data={data} refetchReviews={refetch} />
        ))}
      </Container>
    </div>
  )
}
