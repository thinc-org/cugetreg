import styled from '@emotion/styled'
import { HeadingToolbar } from '@udecode/plate'

export const ToolbarButtonWrapper = styled.div`
  margin: 0;
  color: ${({ theme }) => theme.palette.primaryRange[200]};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-bottom: 0;
  border-top-left-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border-top-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
  & > div > span.slate-ToolbarButton-active {
    & button {
      background-color: rgba(0, 0, 0, 0.1);
    }
    & svg {
      color: ${({ theme }) => theme.palette.primary.main}!important;
    }
  }
`

export const StyledHeadingToolbar = styled(HeadingToolbar)`
  margin: 0 !important;
  border-bottom: 0 !important;
  padding: ${({ theme }) => theme.spacing(1, 2)}!important;
  gap: 8px;
`

export const VerticalDivider = styled.div`
  border-left: 1px solid ${({ theme }) => theme.palette.divider};
  align-self: stretch;
`
