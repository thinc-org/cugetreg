import RejectModal from '@admin-web/module/pendingReviews/components/rejectModal'
import { Review, Semester } from '@cgr/codegen'
import { Warning } from '@mui/icons-material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import StarIcon from '@mui/icons-material/Star'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import DOMPurify from 'isomorphic-dompurify'
import { useState } from 'react'
interface SinglePendingReviewProps {
  data: Review
}

export default function SinglePendingReview({ data }: SinglePendingReviewProps) {
  const [reject, setReject] = useState(false)

  const [rejectionReason, setRejectionReason] = useState('')
  const handleReject = () => {
    setReject(true)
  }
  const handleClose = () => setReject(false)
  const bgcolor = reject ? '#FFEDD5' : undefined

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
            <IconButton>
              <CheckCircleOutlineIcon color="success" />
            </IconButton>
            <IconButton onClick={handleReject}>
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
          <TextField onChange={(e) => setRejectionReason(e.target.value)} />
          {/* TODO: REJECT */}
          <Button variant="contained" sx={{ bgcolor: '#D54C0C', width: 240, height: 40 }}>
            <Typography>Done</Typography>
          </Button>
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
