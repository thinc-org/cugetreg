import { Delete, Visibility, VisibilityOff } from '@mui/icons-material'
import { Stack, Button, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/system'
import { useTranslation } from 'react-i18next'

import { courseCartStore } from '@/store'

import { useCourseDialog } from '../context'

export function CourseDialogActions() {
  const { t } = useTranslation('courseDialog')
  const { item, onClose, onRemove } = useCourseDialog()
  const { isHidden } = item
  const toggleVisible = () => {
    courseCartStore.toggleHiddenItem(item)
  }
  const handleRemove = () => {
    onRemove()
    onClose()
    courseCartStore.removeCourse(item)
  }
  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Stack direction={['column', 'row']} gap={2} pt={[2, 0]}>
      <Button
        variant="outlined"
        startIcon={isHidden ? <Visibility /> : <VisibilityOff />}
        fullWidth
        onClick={toggleVisible}
        size={match ? 'medium' : 'small'}
      >
        {isHidden ? t('show') : t('hide')}
      </Button>
      <Button
        variant="outlined"
        startIcon={<Delete />}
        fullWidth
        color="error"
        onClick={handleRemove}
        size={match ? 'medium' : 'small'}
      >
        {t('remove')}
      </Button>
    </Stack>
  )
}
