import styled from '@emotion/styled'
import { Stack as MuiStack } from '@mui/material'

export const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
`

export const TitleStack = styled(MuiStack)`
  margin: 0;
`

export const Stack = styled(MuiStack)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

export const StickyStack = styled(MuiStack)`
  position: sticky;
  top: 0;
  margin-bottom: 0;
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  z-index: ${({ theme }) => theme.zIndex.appBar + 1};
  background: white;
  button {
    background: ${({ theme }) => theme.palette.background.default};
  }
`
