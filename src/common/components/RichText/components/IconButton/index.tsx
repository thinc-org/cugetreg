import { useTheme } from '@mui/material'
import { includes } from 'lodash'
import { useSlate } from 'slate-react'

import { RichTextMarkType, RichTextBlockType, RichTextActionType } from '../../types'
import { isBlockActive } from '../../utils/isBlockActive'
import { isMarkActive } from '../../utils/isMarkActive'
import { toggleBlock } from '../../utils/toggleBlock'
import { toggleMark } from '../../utils/toggleMark'
import { StyledIconButton, BootstrapTooltip } from './styled'
import { IconButtonProps } from './types'

export const IconButton: React.FC<IconButtonProps> = ({ format, icon: Icon, ...props }) => {
  const editor = useSlate()
  const theme = useTheme()

  const handleMouseDown: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    if (includes(Object.values(RichTextMarkType), format)) {
      toggleMark(editor, format as RichTextMarkType)
    } else if (includes(Object.values(RichTextBlockType), format)) {
      toggleBlock(editor, format as RichTextBlockType)
    } else if (includes(Object.values(RichTextActionType), format)) {
      // toggleMark(editor, format as RichTextFormatType)
    }
  }

  let active = false
  if (includes(Object.values(RichTextMarkType), format)) {
    active = isMarkActive(editor, format as RichTextMarkType)
  } else if (includes(Object.values(RichTextBlockType), format)) {
    active = isBlockActive(editor, format as RichTextBlockType)
  } else if (includes(Object.values(RichTextActionType), format)) {
    active = false
  }

  return (
    <BootstrapTooltip title={format} arrow>
      <StyledIconButton onMouseDown={handleMouseDown} disableRipple size="small" {...props} active={active}>
        <Icon fontSize="0.9em" color={active ? theme.palette.primary.main : theme.palette.primaryRange[200]} />
      </StyledIconButton>
    </BootstrapTooltip>
  )
}
