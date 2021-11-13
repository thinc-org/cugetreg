import { ApolloProvider } from '@apollo/client'
import { CacheProvider } from '@emotion/react'
import { EmotionCache } from '@emotion/utils'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { ThemeProvider, useMediaQuery } from '@mui/material'
import React from 'react'

import { AnalyticsProvider } from '@/common/context/Analytics'
import { useAnalytics } from '@/common/context/Analytics/hooks/useAnalytics'
import { darkTheme, lightTheme } from '@/configs/theme'
import { ShoppingCartModalContextProvider } from '@/modules/App/context/ShoppingCartModal'
import { SnackbarContextProvider } from '@/modules/App/context/Snackbar'
import { client } from '@/services/apollo'
import env from '@/utils/env/macro'

interface AppProviderProps {
  children: React.ReactNode
  forceDark: boolean
  emotionCache: EmotionCache
}

export function AppProvider({ children, forceDark, emotionCache }: AppProviderProps) {
  const prefersDarkMode =
    env.features.darkTheme &&
    // features.darkTheme is a constant
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMediaQuery('(prefers-color-scheme: dark)', {
      noSsr: true,
    })

  const { addEvent } = useAnalytics()

  return (
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AnalyticsProvider value={{ addEvent }}>
            <SnackbarContextProvider>
              <ThemeProvider theme={prefersDarkMode || forceDark ? darkTheme : lightTheme}>
                <ShoppingCartModalContextProvider>{children}</ShoppingCartModalContextProvider>
              </ThemeProvider>
            </SnackbarContextProvider>
          </AnalyticsProvider>
        </LocalizationProvider>
      </CacheProvider>
    </ApolloProvider>
  )
}
