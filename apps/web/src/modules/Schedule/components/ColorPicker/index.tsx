import { useTranslation } from 'react-i18next'

import { Button, Fade, Paper, Popper, Stack, Typography } from '@mui/material'
import { ColorButton } from '@web/modules/Schedule/components/ColorButton'
import { ColorClassKey } from '@web/modules/Schedule/components/ColorPicker/hooks/useColorPicker'

import { SCHEDULE_COLORS, ScheduleColor } from './constants'

export interface ColorPickerProps {
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
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      transition
      modifiers={[
        {
          name: 'flip',
          enabled: false,
        },
      ]}
      style={{ zIndex: 50 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Paper elevation={8}>
            <Stack p={3} spacing={3} maxWidth={344}>
              <Typography variant="h4">{t('selectColorFor', scheduleClass)}</Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5}>
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
          </Paper>
        </Fade>
      )}
    </Popper>
  )
}
