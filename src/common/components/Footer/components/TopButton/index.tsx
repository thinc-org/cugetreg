import { useMediaQuery, useTheme } from '@material-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { StyledStack, StyledKeyboardArrowUpIcon, StyledTypography } from './styled'

export function TopButton() {
  const { t } = useTranslation()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  const label = matches && t('footer:topButton')

  return (
    <StyledStack onClick={scrollToTop} spacing={2} direction="row">
      <StyledTypography variant="subtitle1">{label}</StyledTypography>
      <StyledKeyboardArrowUpIcon />
    </StyledStack>
  )
}
