import React from 'react'
import { useTranslation } from 'react-i18next'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { Chip, Hidden, styled, useMediaQuery, useTheme } from '@mui/material'
import { observer } from 'mobx-react'

import { useCourseGroup } from '@web/common/hooks/useCourseGroup'
import { courseCartStore } from '@web/store'

import { Button } from '@libs/react-ui'

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

export const SelectedCoursesButton: React.FC<SelectedCoursesButtonProps> = observer(
  ({ onClick }) => {
    const { t } = useTranslation('selectedCoursesButton')
    const courseGroup = useCourseGroup()
    const coursesNumber = courseCartStore.shopItemsByCourseGroup(courseGroup).length

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
  }
)
