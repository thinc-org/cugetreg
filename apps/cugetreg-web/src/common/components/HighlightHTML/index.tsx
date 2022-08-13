import { styled } from '@mui/material'

export const HighlightHTML = styled('div')`
  ${({ theme }) => theme.palette.primaryRange[700]};

  .slate-h1,
  .slate-h2,
  .slate-h3,
  .slate-h4,
  .slate-h5,
  .slate-h6 {
    margin-top: 0;
    font-weight: 700;
  }
  .slate-h1 {
    font-size: ${({ theme }) => theme.typography.h4.fontSize};
    line-height: ${({ theme }) => theme.typography.h4.lineHeight};
  }
  .slate-p {
    margin: ${({ theme }) => theme.spacing(1, 0)};
  }
  .slate-code {
    font-size: 85%;
    font-family: monospace;
    border-radius: 2px;
    padding: 0.2em 0.4em;
    line-height: normal;
    background: rgba(0, 0, 0, 0.1);
  }
  .slate-blockquote {
    font-size: ${({ theme }) => theme.typography.h6.fontSize};
    line-height: ${({ theme }) => theme.typography.h4.lineHeight};
    color: ${({ theme }) => theme.palette.primaryRange[100]};
    margin: ${({ theme }) => theme.spacing(1, 0)};
    padding: ${({ theme }) => theme.spacing(0, 2)};
    border-left: 2px solid ${({ theme }) => theme.palette.primaryRange[50]};
  }
`
