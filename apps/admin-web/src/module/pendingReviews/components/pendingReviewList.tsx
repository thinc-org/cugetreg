import { useGetPendingReviewsQuery } from '@cgr/codegen'
// import { HighlightHTML } from '@admin-web/common/HighlightHTML'
import DOMPurify from 'isomorphic-dompurify'

export default function PendingReviewsList() {
  const reviewQuery = useGetPendingReviewsQuery()
  return (
    <>
      Reviews:
      {reviewQuery.data?.pendingReviews.map((data) => (
        // Todo: change p tag to highlightHtml
        <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content ?? '') }} />
      ))}
    </>
  )
}
