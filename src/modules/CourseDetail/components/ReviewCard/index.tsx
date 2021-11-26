import { Stack, useTheme } from '@mui/material'
import { MdFlag, MdOutlineStar } from 'react-icons/md'

import { GeneralChip } from '@/common/components/Chips'
import { ReviewInteraction } from '@/common/types/reviews'
import { getSemesterName } from '@/common/utils/getSemesterNname'
import { ReviewReaction } from '@/modules/CourseDetail/components/ReviewReaction'

import { Card, CardTerm, CardContent, CardRating, CardMaxRating } from './styled'
import { ReviewCardProps } from './types'

export const ReviewCard: React.FC<ReviewCardProps> = ({
  academicYear,
  semester,
  content,
  likeCount,
  dislikeCount,
  rating,
  pending,
  myInteraction,
}) => {
  const term = `${academicYear} ${getSemesterName(semester)}`
  const theme = useTheme()

  return (
    <Card direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center">
          <CardTerm>{term}</CardTerm>
          {pending && <GeneralChip type="reviewPending" />}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <MdOutlineStar size={20} />
          <CardRating>{rating / 2}</CardRating>
          <CardMaxRating>จาก 5</CardMaxRating>
        </Stack>
      </Stack>
      <CardContent>{content}</CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={4}>
          <ReviewReaction
            type={ReviewInteraction.Like}
            defaultPressed={myInteraction === ReviewInteraction.Like}
            reactionCount={likeCount}
          />
          <ReviewReaction
            type={ReviewInteraction.Dislike}
            defaultPressed={myInteraction === ReviewInteraction.Dislike}
            reactionCount={dislikeCount}
          />
        </Stack>
        <MdFlag size={24} color={theme.palette.primaryRange[50]} />
      </Stack>
    </Card>
  )
}
