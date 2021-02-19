import { AppProps } from 'next/dist/next-server/lib/router/router'
import { ThemeProvider, CssBaseline, useMediaQuery } from '@material-ui/core'
import Head from 'next/head'

import '@/styles/globals.css'
import '@/i18n'
import { darkTheme, lightTheme } from '@/configs/theme'
import { TopBar } from '@/components/TopBar'
import { Container } from '@/components/Container'
import env from '@/utils/env/macro'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { ApolloProvider } from '@apollo/client'
import { client } from '@/utils/network/apollo'
import useApp from '@/hooks/useApp'
import { mobxConfiguration } from '@/configs/mobx'
import { ShoppingCartProvider } from '@/contexts/shoppingCart'

mobxConfiguration()

function MyApp({ Component, pageProps, forceDark }: AppProps) {
  const prefersDarkMode =
    env.features.darkTheme &&
    // features.darkTheme is a constant
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMediaQuery('(prefers-color-scheme: dark)', {
      noSsr: true,
    })

  useApp()

  return (
    <>
      <Head>
        <title>CU Get Reg</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ShoppingCartProvider>
        <ApolloProvider client={client}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeProvider theme={prefersDarkMode || forceDark ? darkTheme : lightTheme}>
              <CssBaseline />
              <TopBar />
              <Container>
                <Component {...pageProps} />
              </Container>
            </ThemeProvider>
          </MuiPickersUtilsProvider>
        </ApolloProvider>
      </ShoppingCartProvider>
    </>
  )
}

export default MyApp
