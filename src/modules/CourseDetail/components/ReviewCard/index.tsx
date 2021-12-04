import { IconButton, Stack, useTheme } from '@mui/material'
import { useContext } from 'react'
import { MdFlag, MdDeleteOutline, MdOutlineStar, MdEdit } from 'react-icons/md'

import { GeneralChip } from '@/common/components/Chips'
import { OtherChipKey } from '@/common/components/Chips/config'
import { ReviewInteraction, ReviewStatus } from '@/common/types/reviews'
import { getSemesterName } from '@/common/utils/getSemesterName'
import { ReviewContext } from '@/modules/CourseDetail/context/Review'

import { ReviewReaction } from '../ReviewReaction'
import { Card, CardTerm, CardContent, CardRating, CardMaxRating, CardRejectedMessage } from './styled'
import { ReviewCardProps } from './types'

export const ReviewCard: React.FC<ReviewCardProps> = (data) => {
  const theme = useTheme()
  const actionIconProps = {
    size: 24,
    color: theme.palette.primaryRange[50],
  }

  const term = `${data.academicYear} ${getSemesterName(data.semester)}`

  const getChipType = (): OtherChipKey | null => {
    switch (data.status) {
      case ReviewStatus.Pending:
        return 'reviewPending'
      case ReviewStatus.Rejected:
        return 'reviewRejected'
      default:
        return null
    }
  }

  const chipType = getChipType()

  const { setInteraction, reportReview, deleteMyPendingReview, editMyPendingReview } = useContext(ReviewContext)

  const handleLikeClick = () => {
    setInteraction(data._id, ReviewInteraction.Like)
  }

  const handleDislikeClick = () => {
    setInteraction(data._id, ReviewInteraction.Dislike)
  }

  const handleReportClick = () => {
    reportReview(data._id)
  }

  const handleDeleteClick = () => {
    deleteMyPendingReview(data._id)
  }

  const handleEditClick = () => {
    const srollToElement = document.getElementById('review-title')
    if (srollToElement) {
      const offset = 100
      const offsetTop = srollToElement.offsetTop
      window.scrollTo({ top: offsetTop - offset, behavior: 'smooth' })
    }
    editMyPendingReview(data._id)
  }

  const OwnerIconAction = () => {
    return (
      <Stack direction="row" spacing={1} ml="auto">
        <IconButton size="small">
          <MdEdit {...actionIconProps} onClick={handleEditClick} />
        </IconButton>
        <IconButton size="small">
          <MdDeleteOutline {...actionIconProps} onClick={handleDeleteClick} />
        </IconButton>
      </Stack>
    )
  }

  return (
    <Card direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between" gap={1} flexWrap="wrap">
        <Stack direction="row" spacing={2} alignItems="center">
          <CardTerm>{term}</CardTerm>
          {chipType && <GeneralChip type={chipType} />}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <MdOutlineStar size={20} />
          <CardRating>{data.rating / 2}</CardRating>
          <CardMaxRating>จาก 5</CardMaxRating>
        </Stack>
      </Stack>
      <CardContent>{data.content}</CardContent>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {/** Left side */}
        {data.status === ReviewStatus.Rejected ? (
          <CardRejectedMessage>กรุณาแก้ไข ก่อนส่งความคิดเห็นอีกครั้ง</CardRejectedMessage>
        ) : (
          <Stack direction="row" spacing={3}>
            <ReviewReaction
              type={ReviewInteraction.Like}
              pressed={data.myInteraction === ReviewInteraction.Like}
              reactionCount={data.likeCount}
              onClick={handleLikeClick}
            />
            <ReviewReaction
              type={ReviewInteraction.Dislike}
              pressed={data.myInteraction === ReviewInteraction.Dislike}
              reactionCount={data.dislikeCount}
              onClick={handleDislikeClick}
            />
          </Stack>
        )}

        {/** Right side */}
        {data.isOwner ? (
          <OwnerIconAction />
        ) : (
          <IconButton size="small">
            <MdFlag {...actionIconProps} onClick={handleReportClick} />{' '}
          </IconButton>
        )}
      </Stack>
    </Card>
  )
}
