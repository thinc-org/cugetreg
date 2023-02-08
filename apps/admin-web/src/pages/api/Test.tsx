import { useGetPendingReviewsQuery } from '@cgr/codegen'

export default function Test() {
  const reviewQuery = useGetPendingReviewsQuery()
  console.log(reviewQuery)
  return (
    <>
      Reviews:
      {reviewQuery.data?.pendingReviews.map((it) => it.content)}
    </>
  )
}
