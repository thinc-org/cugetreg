import React from 'react'

import { ApolloProvider } from '@apollo/client'
import { client } from '@/utils/network/apollo'
import { AnalyticsProvider } from '@/context/analytics'
import { ShoppingCartModalProvider } from '@/context/ShoppingCartModal'
import { SnackbarContextProvider } from '@/context/Snackbar'
import { ModalProps } from '@/context/ShoppingCartModal/types'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import { ThemeProvider, useMediaQuery } from '@material-ui/core'

import { useAnalytics } from '@/context/analytics/hooks'

import env from '@/utils/env/macro'
import { darkTheme, lightTheme } from '@/configs/theme'
import { SnackbarProps } from '@/context/Snackbar/types'
import { HistoryProvider } from '@/context/History'

interface AppProviderProps {
  children: React.ReactNode
  snackBarContextValue: SnackbarProps
  forceDark: boolean
  disclosureValue: ModalProps
}

export function AppProvider({ children, snackBarContextValue, forceDark, disclosureValue }: AppProviderProps) {
  const prefersDarkMode =
    env.features.darkTheme &&
    // features.darkTheme is a constant
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMediaQuery('(prefers-color-scheme: dark)', {
      noSsr: true,
    })

  const { addEvent } = useAnalytics()

  return (
    <HistoryProvider>
      <ApolloProvider client={client}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AnalyticsProvider value={{ addEvent }}>
            <SnackbarContextProvider value={snackBarContextValue}>
              <ShoppingCartModalProvider value={disclosureValue}>
                <ThemeProvider theme={prefersDarkMode || forceDark ? darkTheme : lightTheme}>{children}</ThemeProvider>
              </ShoppingCartModalProvider>
            </SnackbarContextProvider>
          </AnalyticsProvider>
        </LocalizationProvider>
      </ApolloProvider>
    </HistoryProvider>
  )
}
