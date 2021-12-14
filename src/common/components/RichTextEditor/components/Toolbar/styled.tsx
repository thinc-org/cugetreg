import { styled } from '@mui/material'
import { HeadingToolbar } from '@udecode/plate-toolbar'

export const StyledHeadingToolbar = styled(HeadingToolbar)`
  margin: 0 !important;
  border: 1px solid ${({ theme }) => theme.palette.divider}!important;
  border-bottom: 0 !important;
  border-top-left-radius: ${({ theme }) => theme.shape.borderRadius}px!important;
  border-top-right-radius: ${({ theme }) => theme.shape.borderRadius}px!important;
  margin: 0 !important;
  border-bottom: 0 !important;
  padding: ${({ theme }) => theme.spacing(1, 2)}!important;
  gap: 8px;
  display: flex;
`

export const VerticalDivider = styled('div')`
  border-left: 1px solid ${({ theme }) => theme.palette.divider};
  align-self: stretch;
`
