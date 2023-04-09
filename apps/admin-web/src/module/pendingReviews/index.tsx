import PendingReviewsList from '@admin-web/module/pendingReviews/components/pendingReviewList'

import Topbar from './components/Topbar'

export function PendingReviewsPage() {
  return (
    <div>
      <Topbar />
      <PendingReviewsList />
    </div>
  )
}
