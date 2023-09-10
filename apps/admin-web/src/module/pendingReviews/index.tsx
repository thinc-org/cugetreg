/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'

import PendingReviewsList from '@admin-web/module/pendingReviews/components/pendingReviewList'

import Topbar from './components/Topbar'

export function PendingReviewsPage() {
  const [year, setYear] = useState<string>('')
  const [semester, setSemester] = useState<string>('')
  return (
    <div>
      <Topbar year={year} semester={semester} setYear={setYear} setSemester={setSemester} />
      <PendingReviewsList year={year} semester={semester} />
    </div>
  )
}
