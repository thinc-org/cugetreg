import styled from '@emotion/styled'
import { NativeSelect } from '@material-ui/core'

export const CustomSelect = styled(NativeSelect)`
  &&& select {
    height: 24px;
    padding: 4px 32px 4px 16px;
    border: 1.5px solid ${({ theme }) => theme.palette.primaryRange[50]};
    border-radius: 4px;

    &:focus {
      border-radius: 4px;
      background: none;
    }
  }

  svg {
    margin-right: 8px;
  }

  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
`
