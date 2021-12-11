import { Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ResponsiveDialog } from '@/common/components/ResponsiveDialog'
import { ColorButton } from '@/modules/Schedule/components/ColorButton'
import { ColorClassKey } from '@/modules/Schedule/components/ColorPicker/hooks/useColorPicker'

import { ScheduleColor, SCHEDULE_COLORS } from './constants'

export interface ColorPickerProps {
  open: boolean
  handleClose: () => void
  scheduleClass: ColorClassKey
  setColor: (color: ScheduleColor) => void
  selectedColor: ScheduleColor | undefined
}

export const ColorPicker = (props: ColorPickerProps) => {
  const { open, handleClose, scheduleClass, setColor, selectedColor = 'primary' } = props
  const { t } = useTranslation('colorPicker')
  return (
    <ResponsiveDialog open={open} onClose={handleClose} shouldExpand={false} maxWidth="xs">
      <Stack p={3} spacing={3}>
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
    </ResponsiveDialog>
  )
}
