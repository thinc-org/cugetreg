import { ApolloProvider } from '@apollo/client'
import { CacheProvider } from '@emotion/react'
import { EmotionCache } from '@emotion/utils'
import { ThemeProvider, useMediaQuery } from '@mui/material'

import React from 'react'

import { AnalyticsProvider } from '@/common/context/Analytics'
import { useAnalytics } from '@/common/context/Analytics/hooks/useAnalytics'
import { darkTheme, lightTheme } from '@/configs/theme'
import { env } from '@/env'
import { Dialog } from '@/lib/dialog'
import { ShoppingCartModalContextProvider } from '@/modules/App/context/ShoppingCartModal'
import { client } from '@/services/apollo'

interface AppProviderProps {
  children: React.ReactNode
  forceDark: boolean
  emotionCache: EmotionCache
}

export function AppProvider({ children, forceDark, emotionCache }: AppProviderProps) {
  const prefersDarkMode =
    env.enable.darkTheme &&
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
