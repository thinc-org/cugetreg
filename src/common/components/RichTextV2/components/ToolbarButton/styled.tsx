import { Tooltip, tooltipClasses, styled, TooltipProps } from '@mui/material'

export const SpanWrapper = styled('span')`
  span[data-testid='ToolbarButton'] {
    & svg {
      color: ${({ theme }) => theme.palette.primaryRange[200]};
    }
    &.slate-ToolbarButton-active button {
      background-color: rgba(0, 0, 0, 0.1);
    }
    &.slate-ToolbarButton-active svg {
      color: ${({ theme }) => theme.palette.primary.main}!important;
    }
  }
`

export const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))`
  & .${tooltipClasses.arrow} {
    color: ${({ theme }) => theme.palette.common.black};
  }
  & .${tooltipClasses.tooltip} {
    background-color: ${({ theme }) => theme.palette.common.black};
  }
`
