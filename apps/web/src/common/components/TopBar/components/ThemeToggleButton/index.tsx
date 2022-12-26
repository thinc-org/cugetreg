import React from 'react'
import { useTranslation } from 'react-i18next'

import Brightness3RoundedIcon from '@mui/icons-material/Brightness3Rounded'
import Brightness7RoundedIcon from '@mui/icons-material/Brightness7Rounded'
import { Button } from '@mui/material'

import { useThemeType } from '@web/modules/App/context/ThemeContext'

import { IconButtonWithBorder } from './styled'
import { ThemeToggleButtonType } from './types'

const ThemeToggleButton = ({ variant }: ThemeToggleButtonType) => {
  const { toggleType, type } = useThemeType()
  const { t } = useTranslation('theme')

  // icon variant
  if (variant == 'icon')
    return (
      <IconButtonWithBorder onClick={toggleType} size="small" disableRipple>
        {type == 'Light' ? (
          <Brightness3RoundedIcon color="primary" />
        ) : (
          <Brightness7RoundedIcon color="primary" />
        )}
      </IconButtonWithBorder>
    )

  // text variant
  return (
    <Button variant="contained" onClick={toggleType} size="small">
      โหมด{type == 'Light' ? t('dark') : t('light')}
    </Button>
  )
}

export default ThemeToggleButton
