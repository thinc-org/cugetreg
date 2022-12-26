import React, { createContext, useContext, useState } from 'react'

import { ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material'

import { darkTheme, lightTheme } from '@web/configs/theme'
import { ENABLE_DARK_THEME } from '@web/env'

import { IThemeContext, ThemeProviderProps, ThemeType } from './types'

export const ThemeContext = createContext<IThemeContext>({} as IThemeContext)

export const useThemeType = () => useContext(ThemeContext)

export const ThemeProvider = ({ children, forceDark }: ThemeProviderProps) => {
  const prefersDarkMode =
    // features.darkTheme is a constant
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMediaQuery('(prefers-color-scheme: dark)', {
      noSsr: true,
    })

  const [type, setType] = useState<ThemeType>(prefersDarkMode || forceDark ? 'Dark' : 'Light')
  const toggleType = () => {
    if (!forceDark) setType((type) => (type == 'Light' ? 'Dark' : 'Light'))
  }

  return (
    <ThemeContext.Provider value={{ type, toggleType }}>
      <MuiThemeProvider theme={type == 'Dark' && ENABLE_DARK_THEME ? darkTheme : lightTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}
