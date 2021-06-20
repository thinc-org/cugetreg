import React from 'react'
import styled from '@emotion/styled'

import { Box, Button } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { courseCartStore } from '@/store'

const Number = styled.div`
  position: absolute;
  right: 0;
  line-height: 0.2rem;
  border-radius: 100%;
  padding: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.palette.secondary.main};
`

export interface SelectedCoursesButtonProps {}

export const SelectedCoursesButton: React.FC<SelectedCoursesButtonProps> = () => {
  const { t } = useTranslation('selectedCoursesButton')
  const coursesNumber = courseCartStore.shopItems.length

  return (
    <Box sx={{ position: 'relative', maxWidth: 150, width: '100%' }}>
      <Number>{coursesNumber}</Number>
      <Button startIcon={<CalendarTodayIcon />} variant="outlined" fullWidth>
        {t('main')}
      </Button>
    </Box>
  )
}
