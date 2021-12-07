import {
  tooltipClasses,
  Tooltip,
  TooltipProps,
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
} from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledIconButton = styled(MuiIconButton)<MuiIconButtonProps & { active?: boolean }>`
  background-color: ${({ active }) => (active ? 'rgba(0,0,0,0.1)' : 'none')};
  &:hover {
    background-color: ${({ active }) => (active ? 'rgba(0,0,0,0.1)' : 'none')};
  }
`

export const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} arrow placement="top-start" />
))`
  & .${tooltipClasses.arrow} {
    color: ${({ theme }) => theme.palette.common.black};
  }
  & .${tooltipClasses.tooltip} {
    background-color: ${({ theme }) => theme.palette.common.black};
  }
`
