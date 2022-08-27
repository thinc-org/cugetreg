import { IconBaseProps } from 'react-icons/lib'
import { MdThumbDown, MdThumbDownOffAlt, MdThumbUp, MdThumbUpOffAlt } from 'react-icons/md'

import { IconButton, Stack, Typography, useTheme } from '@mui/material'

import { ReviewInteractionType } from '@web/common/types/reviews'

import { ReviewReactionProps } from './types'

export const ReviewReaction: React.FC<ReviewReactionProps> = ({
  type,
  pressed,
  reactionCount,
  onClick,
}) => {
  const theme = useTheme()

  const getColor = () => {
    if (pressed) {
      switch (type) {
        case ReviewInteractionType.Like:
          return theme.palette.highlight.green[500]
        case ReviewInteractionType.Dislike:
          return theme.palette.highlight.red[500]
      }
    }
    return theme.palette.primaryRange[50]
  }

  const SelectedIcon = (props: IconBaseProps) => {
    const color = getColor()
    const modifiedProps: IconBaseProps = { ...props, color, size: 20 }
    switch (type) {
      case ReviewInteractionType.Like:
        return !pressed ? <MdThumbUpOffAlt {...modifiedProps} /> : <MdThumbUp {...modifiedProps} />
      case ReviewInteractionType.Dislike:
        return !pressed ? (
          <MdThumbDownOffAlt {...modifiedProps} />
        ) : (
          <MdThumbDown {...modifiedProps} />
        )
      default:
        return !pressed ? <MdThumbUpOffAlt {...modifiedProps} /> : <MdThumbUp {...modifiedProps} />
    }
  }

  return (
    <Stack spacing={0.5} direction="row" alignItems="center" onClick={onClick}>
      <IconButton size="small">
        <SelectedIcon />
      </IconButton>
      <Typography variant="h6" color={getColor()}>
        {reactionCount}
      </Typography>
    </Stack>
  )
}
