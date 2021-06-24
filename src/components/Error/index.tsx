import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, BoxProps } from '@material-ui/core'

export interface ErrorProps extends BoxProps {
  message?: string
  fullWidth?: boolean
}

interface ContainerProps {
  $fullWidth?: boolean
}

const Container = styled(Box)<ContainerProps>`
  ${({ $fullWidth }) =>
    $fullWidth ??
    css`
      width: 100%;
    `}
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

export const Error: React.FC<ErrorProps> = ({ fullWidth = false, message }) => {
  return (
    <Container $fullWidth={fullWidth} mr="auto">
      {message}
    </Container>
  )
}
