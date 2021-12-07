import { IconButtonProps as MuiIconButtonProps } from '@mui/material'

import { IconType } from 'react-icons'

import { RichTextFormatType, RichTextElementType, RichTextActionType } from '../../types'

export interface IconButtonProps extends MuiIconButtonProps {
  format: RichTextFormatType | RichTextElementType | RichTextActionType
  icon: IconType
  active?: boolean
}
