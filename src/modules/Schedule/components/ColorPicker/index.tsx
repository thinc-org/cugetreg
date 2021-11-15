import { Box, Button, ButtonProps, Popover, Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ColorClassKey } from '@/modules/Schedule/components/ColorPicker/hooks/useColorPicker'

import { ScheduleColor, SCHEDULE_COLORS } from './constants'
import { useColor } from './hooks/useColor'

interface ColorPickerProps {
  open: boolean
  handleClose: () => void
  scheduleClass: ColorClassKey
  anchorEl: HTMLElement | null
  setColor: (color: ScheduleColor) => void
  selectedColor: ScheduleColor | undefined
}

export const ColorPicker = (props: ColorPickerProps) => {
  const { open, handleClose, scheduleClass, anchorEl, setColor, selectedColor = 'primary' } = props
  const { t } = useTranslation('colorPicker')
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Stack p={2} spacing={3} maxWidth={340}>
        <Typography variant="h4">{t('selectColorFor', scheduleClass)}</Typography>
        <Stack direction="row" flexWrap="wrap">
          {SCHEDULE_COLORS.map((color) => (
            <ColorButton
              key={color}
              isActive={color === selectedColor}
              scheduleColor={color}
              onClick={() => setColor(color)}
            />
          ))}
        </Stack>
        <Button variant="outlined" onClick={handleClose}>
          {t('select')}
        </Button>
      </Stack>
    </Popover>
  )
}

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
      <Circle color={scheduleColor} />
    </Button>
  )
}

interface CircleProps {
  color: ScheduleColor
  size?: number
}

export const Circle = ({ color, size = 40 }: CircleProps) => {
  const scheme = useColor(color)
  return (
    <Box
      sx={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background: scheme.background,
        border: `1px solid ${scheme.border}`,
        borderRadius: 100,
      }}
    />
  )
}
