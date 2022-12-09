import { useTheme } from '@mui/material'

import { ColorCircle } from '@web/modules/Schedule/components/ColorCircle'
import { ScheduleColor } from '@web/modules/Schedule/components/ColorPicker/constants'

import { Button, ButtonProps } from '@libs/react-ui'

interface ColorButtonProps extends ButtonProps {
  isActive: boolean
  scheduleColor: ScheduleColor
}

export const ColorButton = ({ isActive, scheduleColor, ...buttonProps }: ColorButtonProps) => {
  const theme = useTheme()
  return (
    <Button
      variant="text"
      sx={{
        minWidth: 0,
        background: isActive ? theme.palette.primaryRange[30] : undefined,
        ':hover': {
          background: theme.palette.primaryRange[30],
        },
      }}
      {...buttonProps}
    >
      <ColorCircle color={scheduleColor} />
    </Button>
  )
}
