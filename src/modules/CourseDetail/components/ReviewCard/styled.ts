import styled from '@emotion/styled'
import { Typography, Stack } from '@mui/material'

export const Card = styled(Stack)`
  padding: ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
`

const MainTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.main};
`
export const CardTerm = styled(MainTypography)``
CardTerm.defaultProps = { variant: 'h5' }

export const CardContent = styled(MainTypography)`
  text-align: justify;
`
CardContent.defaultProps = { variant: 'body1' }

export const CardRating = styled(MainTypography)`
  align-self: flex-end;
`
CardRating.defaultProps = { variant: 'h5' }

export const CardMaxRating = styled(Typography)`
  align-self: flex-end;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.primaryRange[100]};
`
CardMaxRating.defaultProps = { variant: 'subtitle2' }
