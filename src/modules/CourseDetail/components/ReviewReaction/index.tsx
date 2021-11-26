import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/system'
import { useState } from 'react'
import { IconBaseProps } from 'react-icons/lib'
import { MdThumbUpOffAlt, MdThumbUp, MdThumbDownOffAlt, MdThumbDown } from 'react-icons/md'

import { ReviewReactionProps, ReviewReactionType } from './types'

export const ReviewReaction: React.FC<ReviewReactionProps> = ({ type, defaultPressed, reactionCount }) => {
  const theme = useTheme()
  const [pressed, setPressed] = useState(defaultPressed)

  const handleClick = () => {
    // TODO: send the result to server
    setPressed(!pressed)
  }

  const getColor = () => {
    if (pressed) {
      switch (type) {
        case ReviewReactionType.Like:
          return theme.palette.highlight.green[500]
        case ReviewReactionType.Dislike:
          return theme.palette.highlight.red[500]
      }
    }
    return theme.palette.primaryRange[50]
  }

  const SelectedIcon = (props: IconBaseProps) => {
    const color = theme.palette.primaryRange[50]
    const modifiedProps: IconBaseProps = { ...props, color, size: 20 }
    switch (type) {
      case ReviewReactionType.Like:
        return !pressed ? <MdThumbUpOffAlt {...modifiedProps} /> : <MdThumbUp {...modifiedProps} color={getColor()} />
      case ReviewReactionType.Dislike:
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
    <Stack spacing={1} direction="row" onClick={handleClick} alignItems="center">
      <SelectedIcon />
      <Typography variant="h6" color={getColor()}>
        {reactionCount}
      </Typography>
    </Stack>
  )
}
