import React from 'react'

import { ApolloProvider } from '@apollo/client'
import { CacheProvider } from '@emotion/react'
import { EmotionCache } from '@emotion/utils'
import { ThemeProvider, useMediaQuery } from '@mui/material'
import { AnalyticsProvider } from '@web/common/context/Analytics'
import { useAnalytics } from '@web/common/context/Analytics/hooks/useAnalytics'
import { darkTheme, lightTheme } from '@web/configs/theme'
import { ENABLE_DARK_THEME } from '@web/env'
import { Dialog } from '@web/lib/dialog'
import { ShoppingCartModalContextProvider } from '@web/modules/App/context/ShoppingCartModal'
import { client } from '@web/services/apollo'

interface AppProviderProps {
  children: React.ReactNode
  forceDark: boolean
  emotionCache: EmotionCache
}

export function AppProvider({ children, forceDark, emotionCache }: AppProviderProps) {
  const prefersDarkMode =
    ENABLE_DARK_THEME &&
    // features.darkTheme is a constant
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMediaQuery('(prefers-color-scheme: dark)', {
      noSsr: true,
    })

  const { addEvent } = useAnalytics()

  return (
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <AnalyticsProvider value={{ addEvent }}>
          <ThemeProvider theme={prefersDarkMode || forceDark ? darkTheme : lightTheme}>
            <ShoppingCartModalContextProvider>
              <Dialog />
              {children}
            </ShoppingCartModalContextProvider>
          </ThemeProvider>
        </AnalyticsProvider>
      </CacheProvider>
    </ApolloProvider>
  )
}
