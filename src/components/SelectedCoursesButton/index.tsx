import React from 'react'
import styled from '@emotion/styled'

import { Button, Chip } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { courseCartStore } from '@/store'

const Number = styled(Chip)`
  z-index: 100;
  position: absolute;
  right: 0;
  top: 0;
  margin: -8px;
  padding: ${({ theme }) => theme.spacing(0)};
  background: ${({ theme }) => theme.palette.secondary.main};
`

export interface SelectedCoursesButtonProps {}

export const SelectedCoursesButton: React.FC<SelectedCoursesButtonProps> = () => {
  const { t } = useTranslation('selectedCoursesButton')
  const coursesNumber = courseCartStore.shopItems.length

  return (
    <Button
      startIcon={<CalendarTodayIcon />}
      variant="outlined"
      fullWidth
      sx={{ position: 'relative', maxWidth: 150, width: '100%' }}
    >
      <Number label={coursesNumber} />
      {t('main')}
    </Button>
  )
}
