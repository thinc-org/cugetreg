import { ApolloProvider } from '@apollo/client'
import { CacheProvider } from '@emotion/react'
import { EmotionCache } from '@emotion/utils'
import { ThemeProvider, useMediaQuery } from '@mui/material'

import React from 'react'
import { Toaster, ToastOptions } from 'react-hot-toast'

import { AnalyticsProvider } from '@/common/context/Analytics'
import { useAnalytics } from '@/common/context/Analytics/hooks/useAnalytics'
import { darkTheme, lightTheme } from '@/configs/theme'
import { Dialog } from '@/lib/dialog'
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

  const toastOptions: ToastOptions = {
    style: {
      top: 20,
      fontSize: '0.9rem',
      fontFamily: 'prompt',
      borderRadius: 4,
      padding: 12,
    },
  }

  return (
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <AnalyticsProvider value={{ addEvent }}>
          <SnackbarContextProvider>
            <ThemeProvider theme={prefersDarkMode || forceDark ? darkTheme : lightTheme}>
              <Dialog />
              <Toaster position="top-center" toastOptions={toastOptions} gutter={16} />
              <ShoppingCartModalContextProvider>{children}</ShoppingCartModalContextProvider>
            </ThemeProvider>
          </SnackbarContextProvider>
        </AnalyticsProvider>
      </CacheProvider>
    </ApolloProvider>
  )
}
