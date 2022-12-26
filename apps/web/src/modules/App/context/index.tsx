import React from 'react'

import { ApolloProvider } from '@apollo/client'
import { CacheProvider } from '@emotion/react'
import { EmotionCache } from '@emotion/utils'

import { AnalyticsProvider } from '@web/common/context/Analytics'
import { useAnalytics } from '@web/common/context/Analytics/hooks/useAnalytics'
import { Dialog } from '@web/lib/dialog'
import { ShoppingCartModalContextProvider } from '@web/modules/App/context/ShoppingCartModal'
import { client } from '@web/services/apollo'

import { ThemeProvider } from './ThemeContext'

interface AppProviderProps {
  children: React.ReactNode
  forceDark: boolean
  emotionCache: EmotionCache
}

export function AppProvider({ children, forceDark, emotionCache }: AppProviderProps) {
  const { addEvent } = useAnalytics()

  return (
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <AnalyticsProvider value={{ addEvent }}>
          <ThemeProvider forceDark={forceDark}>
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
