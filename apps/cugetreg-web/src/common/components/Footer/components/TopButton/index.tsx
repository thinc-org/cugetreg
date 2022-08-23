import React from 'react'
import { useTranslation } from 'react-i18next'

import { useMediaQuery, useTheme } from '@mui/material'

import { StyledKeyboardArrowUpIcon, StyledStack, StyledTypography } from './styled'

export function TopButton() {
  const { t } = useTranslation('footer')
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  const label = matches && t('topButton')

  return (
    <StyledStack onClick={scrollToTop} spacing={2} direction="row">
      <StyledTypography variant="subtitle1">{label}</StyledTypography>
      <StyledKeyboardArrowUpIcon />
    </StyledStack>
  )
}
