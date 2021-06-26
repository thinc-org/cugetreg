import styled from '@emotion/styled'
import { BoxProps, useTheme } from '@material-ui/core'

import { PulseLoader } from 'react-spinners'

export interface LoadingProps extends BoxProps {
  loading: boolean
}

const Container = styled.span`
  margin: ${({ theme }) => theme.spacing(2, 'auto', 0, 'auto')};
  width: 100%;
  min-height: 60px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`

export const Loading: React.FC<LoadingProps> = ({ loading }) => {
  const theme = useTheme()

  return (
    <Container>{loading ? <PulseLoader size={8} margin={8} color={theme.palette.primary.main} /> : null}</Container>
  )
}
