import { useState } from 'react'

import { ApolloQueryResult } from '@apollo/client'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import StarIcon from '@mui/icons-material/Star'
import { Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import DOMPurify from 'isomorphic-dompurify'

import {
  Exact,
  GetPendingReviewsQuery,
  Review,
  ReviewStatus,
  Semester,
  useSetReviewStatusMutation,
} from '@cgr/codegen'

interface SinglePendingReviewProps {
  data: Review
  refetchReviews: (
    variables?:
      | Partial<
          Exact<{
            [key: string]: never
          }>
        >
      | undefined
  ) => Promise<ApolloQueryResult<GetPendingReviewsQuery>>
}

// TODO: add toast to enhance user experience
// TODO: add error handler
export default function SinglePendingReview({ data, refetchReviews }: SinglePendingReviewProps) {
  const [reject, setReject] = useState(false)
  const [setReviewStatus, { data: mutateData, loading: mutateLoading, error: mutateError, reset }] =
    useSetReviewStatusMutation()
  const [rejectionReason, setRejectionReason] = useState('')
  const handleReject = () => {
    setReject(true)
  }
  const handleClose = () => setReject(false)
  const bgcolor = reject ? '#FFEDD5' : undefined

  const handleApproved = async () => {
    await setReviewStatus({
      variables: {
        reviewId: data._id,
        status: ReviewStatus.Approved,
      },
    })
    await refetchReviews()
  }

  const handleSendReject = async () => {
    await setReviewStatus({
      variables: {
        reviewId: data._id,
        status: ReviewStatus.Rejected,
        rejectionReason: rejectionReason,
      },
    })
    await refetchReviews()
  }

  return (
    <>
      <Stack px={2.5} py={3} spacing={2} bgcolor={bgcolor}>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <Stack direction={'row'} alignItems={'center'} width={72} height={32}>
              <StarIcon />
              <Typography fontWeight={700}>{data.rating / 2}</Typography>
            </Stack>
            <Typography fontWeight={700}>{data.courseNo} PARAGRAPH WRITING</Typography>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <IconButton disabled={reject} onClick={handleApproved}>
              <CheckCircleOutlineIcon color="success" />
            </IconButton>
            <IconButton disabled={reject} onClick={handleReject}>
              <HighlightOffIcon color="warning" />
            </IconButton>
          </Stack>
        </Stack>

        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Stack direction={'row'} alignItems={'center'} width={72} height={24}>
            <Typography fontWeight={500} color="#6B7280">
              {data.academicYear}
            </Typography>
          </Stack>

          <Stack direction={'row'} alignItems={'center'} width={72} height={24}>
            <Typography fontWeight={500} color="#6B7280">
              {getSemesterName(data.semester as Semester)}
            </Typography>
          </Stack>
        </Stack>

        <Stack sx={{ wordBreak: 'break-word' }}>
          <Typography
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content ?? '') }}
          ></Typography>
        </Stack>
      </Stack>
      {reject && (
        <Stack p={3} pt={1} spacing={2} bgcolor={bgcolor}>
          <Typography fontWeight={700} color="red">
            Reject Reason
          </Typography>
          <TextField multiline onChange={(e) => setRejectionReason(e.target.value)} />
          <Stack direction={'row'} spacing={2}>
            <Button
              variant="contained"
              sx={{ bgcolor: '#D54C0C', width: 240, height: 40 }}
              onClick={handleSendReject}
            >
              <Typography>Done</Typography>
            </Button>
            <Button
              variant="outlined"
              sx={{ borderColor: '#D54C0C', width: 240, height: 40 }}
              onClick={handleClose}
            >
              <Typography sx={{ color: '#D54C0C' }}>Cancel</Typography>
            </Button>
          </Stack>
        </Stack>
      )}
    </>
  )
}

export const getSemesterName = (semester: Semester) => {
  switch (semester) {
    case Semester.First:
      return 'ภาคต้น'
    case Semester.Second:
      return 'ภาคปลาย'
    case Semester.Third:
      return 'ภาคฤดูร้อน'
  }
}
