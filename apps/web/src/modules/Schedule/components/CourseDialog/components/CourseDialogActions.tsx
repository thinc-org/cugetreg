import { useTranslation } from 'react-i18next'

import { Delete, Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, Stack, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material'

import { useRemoveCourse } from '@web/modules/Schedule/hooks/useRemoveCourse'
import { courseCartStore } from '@web/store'

import { useCourseDialog } from '../context'

export function CourseDialogActions() {
  const { t } = useTranslation('courseDialog')
  const { item, onClose, onRemove } = useCourseDialog()
  const { isHidden } = item
  const toggleVisible = () => {
    courseCartStore.toggleHiddenItem(item)
  }
  const removeCourse = useRemoveCourse(item)
  const handleRemove = () => {
    onRemove()
    onClose()
    removeCourse()
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
