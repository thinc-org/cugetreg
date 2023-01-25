import {
  Button as MuiButton,
  DialogContent as MuiDialogContent,
  Paper,
  css,
  styled,
} from '@mui/material'

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

export const StickyPaper = styled(Paper)`
  display: flex;
  position: sticky;
  width: fit-content;
  height: fit-content;
  top: 100px;
`

export const Button = styled(MuiButton)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`
