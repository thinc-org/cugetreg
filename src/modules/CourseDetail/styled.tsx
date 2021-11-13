import styled from '@emotion/styled'
import { Grid, Typography } from '@mui/material'

import { SectionCard } from './components/SectionCard'

export const SectionCardLayout = styled(SectionCard)`
  margin-top: ${({ theme }) => theme.spacing(2)};
`

export const SectionContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(9)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(4)};
  }
`

export const Title = styled(Typography)`
  margin: ${({ theme }) => theme.spacing(2, 0, 2, 0)};
`

export const DescriptionTitle = styled(Typography)`
  color: ${({ theme }) => theme.palette.primaryRange['100']};
`

export const GridContainer = styled(Grid)`
  margin: ${({ theme }) => theme.spacing(4, 0, 6, 0)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin: ${({ theme }) => theme.spacing(3, 0, 2, 0)};
  }
  div {
    padding-bottom: ${({ theme }) => theme.spacing(4)};
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding-bottom: ${({ theme }) => theme.spacing(1)};
    }
  }
`

export const GridEnd = styled(Grid)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding-bottom: ${({ theme }) => theme.spacing(3)} !important;
  }
`

export const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
`
