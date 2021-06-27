import { AppProps } from 'next/dist/next-server/lib/router/router'
import { ThemeProvider, CssBaseline, useMediaQuery } from '@material-ui/core'
import Head from 'next/head'

import '@/styles/globals.css'
import '@/i18n'
import { darkTheme, lightTheme } from '@/configs/theme'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import env from '@/utils/env/macro'

import { ApolloProvider } from '@apollo/client'
import { client } from '@/utils/network/apollo'
import useApp from '@/hooks/useApp'
import { mobxConfiguration } from '@/configs/mobx'

import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'

import { useEffect } from 'react'
import { loadGAPI, startGDriveSync } from '@/utils/network/gDriveSync'
import { runInAction } from 'mobx'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'

import { CourseSearchProvider } from '@/context/CourseSearch'
import { authStore } from '@/store/meStore'
import { collectLogEvent } from '@/utils/network/logging'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'

mobxConfiguration()

function MyApp({ Component, pageProps, forceDark, router }: AppProps) {
  const prefersDarkMode =
    env.features.darkTheme &&
    // features.darkTheme is a constant
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMediaQuery('(prefers-color-scheme: dark)', {
      noSsr: true,
    })

  useApp()

  // Retoring AuthStore and Syncing coursecart
  useEffect(() => {
    if (typeof window === 'undefined') return //Don't sync on the browser

    collectLogEvent({
      kind: 'track',
      message: 'user visit site',
    })

    authStore.tryRestoreWithLocalStorage()
    loadGAPI()
      .then(startGDriveSync)
      .catch((e) => {
        console.error('[GDRIVE] Error while starting drive sync', e)
        runInAction(() => {
          gDriveStore.gDriveState = GDriveSyncState.FAIL
        })
      })
  }, [])

  useEffect(() => {
    collectLogEvent({
      kind: 'track',
      message: `user change path`,
      detail: `${location.origin}-${router.pathname}`,
    })
  }, [router.pathname])

  return (
    <>
      <Head>
        <title>CU Get Reg</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ApolloProvider client={client}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CourseSearchProvider>
            <ThemeProvider theme={prefersDarkMode || forceDark ? darkTheme : lightTheme}>
              <CssBaseline />
              <TopBar />
              <ErrorBoundary>
                <Container>
                  <Component {...pageProps} />
                </Container>
              </ErrorBoundary>
              <Footer />
            </ThemeProvider>
          </CourseSearchProvider>
        </LocalizationProvider>
      </ApolloProvider>
    </>
  )
}

export default MyApp
