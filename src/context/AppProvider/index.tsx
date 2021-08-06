import { ApolloProvider } from '@apollo/client'
import { ThemeProvider, useMediaQuery } from '@material-ui/core'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import React from 'react'

import { darkTheme, lightTheme } from '@/configs/theme'
import { ShoppingCartModalProvider } from '@/context/ShoppingCartModal'
import { ModalProps } from '@/context/ShoppingCartModal/types'
import { SnackbarContextProvider } from '@/context/Snackbar'
import { SnackbarProps } from '@/context/Snackbar/types'
import { AnalyticsProvider } from '@/context/analytics'
import { useAnalytics } from '@/context/analytics/hooks'
import env from '@/utils/env/macro'
import { client } from '@/utils/network/apollo'

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
  )
}
