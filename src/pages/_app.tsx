import { AppProps } from 'next/dist/next-server/lib/router/router'
import { ThemeProvider, CssBaseline, useMediaQuery, Button, Snackbar, Alert } from '@material-ui/core'
import Head from 'next/head'

import '@/styles/globals.css'
import '@/i18n'
import { darkTheme, lightTheme } from '@/configs/theme'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { ShoppingCartModal } from '@/components/ShoppingCartModal'
import env from '@/utils/env/macro'

import { ApolloProvider } from '@apollo/client'
import { client } from '@/utils/network/apollo'
import useApp from '@/hooks/useApp'
import { useDisclosure } from '@/context/ShoppingCartModal/hooks'
import { mobxConfiguration } from '@/configs/mobx'

import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'

import { useEffect } from 'react'
import { loadGAPI, startGDriveSync } from '@/utils/network/gDriveSync'
import { runInAction } from 'mobx'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'

import { CourseSearchProvider } from '@/context/CourseSearch'
import { ShoppingCartModalProvider } from '@/context/ShoppingCartModal'
import { SnackbarContextProvider } from '@/context/Snackbar'
import { useSnackBar } from '@/context/Snackbar/hooks'
import styled from '@emotion/styled'
import { authStore } from '@/store/meStore'

mobxConfiguration()

const ToastAlert = styled(Alert)`
  div:last-child {
    padding: ${({ theme }) => theme.spacing(0, 0, 0, 2)};
  }
`

function MyApp({ Component, pageProps, forceDark }: AppProps) {
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

  const { message, emitMessage, action: actionText, open, close, isWarning } = useSnackBar()
  const disclosureValue = useDisclosure()
  const handleClose = (_: unknown, reason: string) => {
    if (reason === 'clickaway') {
      return
    }
    close()
  }

  const value = { message, emitMessage, action: actionText }

  return (
    <>
      <Head>
        <title>CU Get Reg</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ApolloProvider client={client}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SnackbarContextProvider value={value}>
            <ShoppingCartModalProvider value={disclosureValue}>
              <ThemeProvider theme={prefersDarkMode || forceDark ? darkTheme : lightTheme}>
                <CssBaseline />
                <TopBar />
                <Container>
                  <Component {...pageProps} />
                </Container>
                <Footer />
                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                  onClose={handleClose}
                  autoHideDuration={6000}
                  open={open}
                >
                  <ToastAlert
                    severity={isWarning ? 'warning' : 'success'}
                    action={
                      <Button size="small" color="inherit" onClick={disclosureValue.onOpen}>
                        {actionText}
                      </Button>
                    }
                  >
                    {message}
                  </ToastAlert>
                </Snackbar>
                <ShoppingCartModal />
              </ThemeProvider>
            </ShoppingCartModalProvider>
          </SnackbarContextProvider>
        </LocalizationProvider>
      </ApolloProvider>
    </>
  )
}

export default MyApp
