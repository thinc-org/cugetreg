import { NativeSelect, styled } from '@mui/material'

export const ConfigBarSelect = styled(NativeSelect)`
  & {
    color: inherit;
    margin-right: -8px;
    font-size: 0.75rem;
    font-family: Poppins, Prompt, sans-serif;
    font-weight: 500;
    letter-spacing: 0.1px;
    line-height: 1.5rem;
    line-height: 24px;

    ::before {
      display: none;
    }

    ::after {
      display: none;
    }

    & select {
      height: 40px;
      padding: 8px;
      box-sizing: border-box;
    }

    ${({ theme }) => theme.breakpoints.down('md')} {
      font-size: 0.5625rem;
      line-height: 0.75rem;
    }
  }

  option {
    ${({ theme }) => theme.breakpoints.up('md')} {
      background-color: ${({ theme }) => theme.palette.primary.main} !important;
    }
  }

  svg {
    color: inherit;
    font-size: 16px;
  }
`
