/* eslint-disable react-hooks/rules-of-hooks */
import { Dispatch, SetStateAction, useState } from 'react'

import PendingReviewsList from '@admin-web/module/pendingReviews/components/pendingReviewList'

import Topbar from './components/Topbar'

const [year, setYear] = useState<string>('')
const [semester, setSemester] = useState<string>('')

export function PendingReviewsPage() {
  return (
    <div>
      <Topbar year={year} semester={semester} setYear={setYear} setSemester={setSemester} />
      <PendingReviewsList />
    </div>
  )
}
