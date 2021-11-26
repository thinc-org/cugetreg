import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import { IconBaseProps } from 'react-icons/lib'
import { MdThumbUpOffAlt, MdThumbUp, MdThumbDownOffAlt, MdThumbDown } from 'react-icons/md'

import { ReviewInteraction } from '@/common/types/reviews'

import { ReviewReactionProps } from './types'

export const ReviewReaction: React.FC<ReviewReactionProps> = ({ type, pressed, reactionCount, onClick }) => {
  const theme = useTheme()

  const getColor = () => {
    if (pressed) {
      switch (type) {
        case ReviewInteraction.Like:
          return theme.palette.highlight.green[500]
        case ReviewInteraction.Dislike:
          return theme.palette.highlight.red[500]
      }
    }
    return theme.palette.primaryRange[50]
  }

  const SelectedIcon = (props: IconBaseProps) => {
    const color = theme.palette.primaryRange[50]
    const modifiedProps: IconBaseProps = { ...props, color, size: 20 }
    switch (type) {
      case ReviewInteraction.Like:
        return !pressed ? <MdThumbUpOffAlt {...modifiedProps} /> : <MdThumbUp {...modifiedProps} color={getColor()} />
      case ReviewInteraction.Dislike:
        return !pressed ? (
          <MdThumbDownOffAlt {...modifiedProps} />
        ) : (
          <MdThumbDown {...modifiedProps} color={getColor()} />
        )
      default:
        return !pressed ? <MdThumbUpOffAlt {...modifiedProps} /> : <MdThumbUp {...modifiedProps} color={getColor()} />
    }
  }

  return (
    <Stack spacing={1} direction="row" alignItems="center" onClick={onClick}>
      <SelectedIcon />
      <Typography variant="h6" color={getColor()}>
        {reactionCount}
      </Typography>
    </Stack>
  )
}
