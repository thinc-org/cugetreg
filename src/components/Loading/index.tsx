import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, BoxProps } from '@material-ui/core'

export interface LoadingProps extends BoxProps {
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

export const Loading: React.FC<LoadingProps> = ({ fullWidth = false }) => {
  return (
    <Container $fullWidth={fullWidth} mr="auto">
      loading
    </Container>
  )
}
