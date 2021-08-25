import { ApolloProvider } from '@apollo/client'
import { ThemeProvider, useMediaQuery } from '@material-ui/core'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import React from 'react'

import { AnalyticsProvider } from '@/common/context/Analytics'
import { useAnalytics } from '@/common/context/Analytics/hooks'
import { ShoppingCartModalProvider } from '@/common/context/ShoppingCartModal'
import { ModalProps } from '@/common/context/ShoppingCartModal/types'
import { SnackbarContextProvider } from '@/common/context/Snackbar'
import { SnackbarProps } from '@/common/context/Snackbar/types'
import { darkTheme, lightTheme } from '@/configs/theme'
import { client } from '@/services/apollo'
import env from '@/utils/env/macro'

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
