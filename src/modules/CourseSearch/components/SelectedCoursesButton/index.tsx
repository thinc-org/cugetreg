import styled from '@emotion/styled'
import { Button, Chip, Hidden, useMediaQuery, useTheme } from '@material-ui/core'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { observer } from 'mobx-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { courseCartStore } from '@/store'

const Number = styled(Chip)`
  z-index: 50;
  position: absolute;
  right: 0;
  top: 0;
  margin: -8px;
  padding: ${({ theme }) => theme.spacing(0)};
  background: ${({ theme }) => theme.palette.secondary.main};
`

const CoursesButton = styled(Button)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: ${({ theme }) => theme.spacing(0.5, 0.5)};
    margin-left: ${({ theme }) => theme.spacing(0.5)} !important;
  }
`

export interface SelectedCoursesButtonProps {
  onClick: () => void
}

export const SelectedCoursesButton: React.FC<SelectedCoursesButtonProps> = observer(({ onClick }) => {
  const { t } = useTranslation('selectedCoursesButton')
  const coursesNumber = courseCartStore.shopItems.length

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <CoursesButton
      startIcon={<CalendarTodayIcon />}
      variant="outlined"
      fullWidth
      sx={{ position: 'relative', maxWidth: isDesktop ? 150 : 100, width: '100%' }}
      onClick={onClick}
    >
      <Number label={coursesNumber} />
      <Hidden smDown>{t('main')}</Hidden>
      <Hidden smUp>{t('mainShort')}</Hidden>
    </CoursesButton>
  )
})
