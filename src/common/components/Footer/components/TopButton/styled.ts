import styled from '@emotion/styled'
import { Typography, Stack } from '@material-ui/core'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

export const StyledStack = styled(Stack)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(1.5, 4)};
  padding: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.breakpoints.down('md')} {
    padding: ${({ theme }) => theme.spacing(1.5, 0.5)};
  }
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
`

export const StyledTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.primaryRange[100]};
`

export const StyledKeyboardArrowUpIcon = styled(KeyboardArrowUpIcon)`
  color: ${({ theme }) => theme.palette.primaryRange[100]};
`
