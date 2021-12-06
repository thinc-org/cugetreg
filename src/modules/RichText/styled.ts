import styled from '@emotion/styled'
import { Editable } from 'slate-react'

export const Toolbar = styled.div`
  padding: ${({ theme }) => theme.spacing(1, 2)};
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-top-left-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border-top-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
  flex-wrap: wrap;
`

export const StyledEditable = styled(Editable)`
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing(1, 2)};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-top: none;
  border-bottom-left-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border-bottom-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
`

export const VerticalDivider = styled.div`
  border-left: 1px solid ${({ theme }) => theme.palette.divider};
  align-self: stretch;
`
