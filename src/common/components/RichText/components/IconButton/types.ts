import { IconButtonProps as MuiIconButtonProps } from '@mui/material'

import { IconType } from 'react-icons'

import { RichTextMarkType, RichTextBlockType, RichTextActionType } from '../../types'

export interface IconButtonProps extends MuiIconButtonProps {
  format: RichTextMarkType | RichTextBlockType | RichTextActionType
  icon: IconType
  active?: boolean
}
