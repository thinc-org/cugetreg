import RejectModal from '@admin-web/module/pendingReviews/components/rejectModal'
import { Review } from '@cgr/codegen'
import { Button, Card, CardActions, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { HighlightHTML } from '../../../common/HighlightHTML/index'
import DOMPurify from 'isomorphic-dompurify'

interface SinglePendingReviewProps {
  data: Review
}

export default function SinglePendingReview({ data }: SinglePendingReviewProps) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      {/* Todo: change p tag to highlightHtml */}
      {/* <Card sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>2100101</Typography>
        <Typography dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content ?? '') }} />
        <CardActions sx={{ display: 'flex', alignSelf: 'flex-end' }}>
          <Button>Approve</Button>
          <Button onClick={handleOpen}>Reject</Button>
        </CardActions>
      </Card> */}
      <RejectModal open={open} onClose={handleClose} />
      <Grid
        container
        // paddingY={16}
        // paddingX={24}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Grid container gap={10}>
            <Grid item>
              <Typography>{data.courseNo}</Typography>
            </Grid>
            <Grid item>
              <Typography>{data.academicYear}</Typography>
            </Grid>
            <Grid item>
              <Typography>{data.semester}</Typography>
            </Grid>
            <Grid item>
              <Typography>{data.rating}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography>
            <Button>1</Button>
            <Button>2</Button>
          </Typography>
        </Grid>
      </Grid>
      <Typography
        paddingX={24}
        paddingTop={6}
        paddingBottom={24}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content ?? '') }}
      />
    </>
  )
}
