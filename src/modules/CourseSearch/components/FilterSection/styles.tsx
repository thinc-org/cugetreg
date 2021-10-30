import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Button as MuiButton, DialogContent as MuiDialogContent, Paper } from '@material-ui/core'

export const DialogContent = styled(MuiDialogContent)`
  padding: ${({ theme }) => theme.spacing(4)};
`

export const Box = styled.div`
  display: flex;
  justify-content: space-between;
  div:first-of-type {
    ${({ theme }) => {
      return css`
        margin-right: ${theme.spacing(12)};
        ${theme.breakpoints.down('sm')} {
          margin-right: ${theme.spacing(2)};
        }
      `
    }};
  }
`

export const StickyPaper = styled(Paper)<{ hasTags: boolean }>`
  min-width: 280px;
  position: sticky;
  top: ${({ hasTags }) => (hasTags ? '125px' : '101px')};

  padding: ${({ theme }) => theme.spacing(4)};
  overflow-y: auto;
  height: min-content;
  max-height: calc(100vh - ${({ hasTags }) => (hasTags ? '125px' : '101px')});
`

export const Button = styled(MuiButton)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`
