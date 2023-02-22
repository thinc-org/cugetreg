import { useState } from 'react'

import { Button, Card, CardActions, Typography } from '@mui/material'
import DOMPurify from 'isomorphic-dompurify'

import RejectModal from '@admin-web/module/pendingReviews/components/rejectModal'

import { Review } from '@cgr/codegen'

interface SinglePendingReviewProps {
  data: Review
}

export default function SinglePendingReview({ data }: SinglePendingReviewProps) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>2100101</Typography>
        {/* Todo: change p tag to highlightHtml */}
        <Typography dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content ?? '') }} />
        <CardActions sx={{ display: 'flex', alignSelf: 'flex-end' }}>
          <Button>Approve</Button>
          <Button onClick={handleOpen}>Reject</Button>
        </CardActions>
      </Card>
      <RejectModal open={open} onClose={handleClose} />
    </>
  )
}
