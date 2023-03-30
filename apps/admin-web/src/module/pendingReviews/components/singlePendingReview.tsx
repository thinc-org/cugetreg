import RejectModal from '@admin-web/module/pendingReviews/components/rejectModal'
import { Review, Semester } from '@cgr/codegen'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { Box, IconButton, TableCell, TableRow, Typography } from '@mui/material'
import DOMPurify from 'isomorphic-dompurify'
import { useState } from 'react'
interface SinglePendingReviewProps {
  data: Review
}

export default function SinglePendingReview({ data }: SinglePendingReviewProps) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <RejectModal open={open} onClose={handleClose} />

      <TableRow>
        <TableCell sx={{ px: 3, py: 2, borderBottom: 'none' }}>
          <Typography fontWeight={700}>{data.courseNo}</Typography>
        </TableCell>
        <TableCell sx={{ px: 3, py: 2, borderBottom: 'none' }}>
          <Typography fontWeight={700}>{data.academicYear}</Typography>
        </TableCell>
        <TableCell sx={{ px: 3, py: 2, borderBottom: 'none' }}>
          <Typography fontWeight={700}>{getSemesterName(data.semester as Semester)}</Typography>
        </TableCell>
        <TableCell sx={{ px: 3, py: 2, borderBottom: 'none' }}>
          <Typography fontWeight={700}>{data.rating / 2}</Typography>
        </TableCell>
        <TableCell sx={{ width: '100%', borderBottom: 'none' }}></TableCell>
        <TableCell sx={{ px: 3, py: 2, borderBottom: 'none' }}>
          <Box sx={{ whiteSpace: 'nowrap' }}>
            <IconButton color="success">
              <CheckCircleOutlineIcon />
            </IconButton>
            <IconButton color="warning">
              <HighlightOffIcon />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ px: 3, py: 2, wordBreak: 'break-word' }}>
          <Typography
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content ?? '') }}
          />
        </TableCell>
      </TableRow>
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
