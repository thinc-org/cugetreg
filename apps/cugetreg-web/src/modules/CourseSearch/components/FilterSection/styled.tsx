import { Button } from '@lib/react-ui'
import { DialogContent as MuiDialogContent, Paper, css, styled } from '@mui/material'

export const DialogContent = styled(MuiDialogContent)`
  padding: ${({ theme }) => theme.spacing(4)};
`

export const Box = styled('div')`
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
  display: flex;
  position: sticky;
  width: fit-content;
  height: fit-content;
  top: ${({ hasTags }) => (hasTags ? '125px' : '101px')};
  max-height: calc(100vh - ${({ hasTags }) => (hasTags ? '125px' : '101px')} - 24px);
`

export const StyledButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`
