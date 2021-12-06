import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { Typography, Stack, StackProps } from '@mui/material'

import { RichTextRenderer } from '@/modules/RichText'

export const Card = styled(Stack, { shouldForwardProp: isPropValid })<StackProps & { pending?: boolean }>`
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  padding: ${({ theme }) => theme.spacing(4)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
  opacity: ${({ pending }) => (pending ? 0.6 : 1)};
`

const MainTypography = styled(Typography)`
  color: ${({ theme }) => theme.palette.primary.main};
`
export const CardTerm = styled(MainTypography)``
CardTerm.defaultProps = { variant: 'h5' }

export const CardContent = styled(RichTextRenderer)``

export const CardRating = styled(MainTypography)`
  align-self: flex-end;
`
CardRating.defaultProps = { variant: 'h5' }

export const CardMaxRating = styled(Typography)`
  align-self: flex-end;
  line-height: 24px;
  color: ${({ theme }) => theme.palette.primaryRange[100]};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`
CardMaxRating.defaultProps = { variant: 'subtitle2' }

export const CardRejectedMessage = styled(Typography)`
  color: ${({ theme }) => theme.palette.highlight.red[500]};
`
CardRejectedMessage.defaultProps = { variant: 'subtitle2' }
