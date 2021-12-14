import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { ColorButton } from '@/modules/Schedule/components/ColorButton'
import { SCHEDULE_COLORS } from '@/modules/Schedule/components/ColorPicker/constants'
import { useColorPicker } from '@/modules/Schedule/components/ColorPicker/hooks/useColorPicker'

import { useCourseDialog } from '../context'

export function CourseDialogColorPicker() {
  const { item, onClose } = useCourseDialog()
  const { t } = useTranslation('courseDialog')
  const { setColor, selectedColor } = useColorPicker(item)

  return (
    <Stack spacing={0.5}>
      <Typography variant="h6">{t('selectColor')}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.5}>
        {SCHEDULE_COLORS.map((color) => (
          <ColorButton
            key={color}
            isActive={color === selectedColor}
            scheduleColor={color}
            onClick={() => {
              setColor(color)
              onClose()
            }}
          />
        ))}
      </Stack>
    </Stack>
  )
}
