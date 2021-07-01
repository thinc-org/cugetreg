import { AppProps } from 'next/dist/next-server/lib/router/router'
import { CssBaseline, Button, Snackbar, Alert } from '@material-ui/core'
import Head from 'next/head'

import '@/styles/globals.css'
import '@/i18n'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'
import { Container } from '@/components/Container'
import { ShoppingCartModal } from '@/components/ShoppingCartModal'

import { syncWithLocalStorage } from '@/utils/localstorage'
import useApp from '@/hooks/useApp'
import { mobxConfiguration } from '@/configs/mobx'

import { useCallback, useEffect, useState } from 'react'
import { setupGAPI, startGDriveSync } from '@/utils/network/gDriveSync'
import { reaction, runInAction } from 'mobx'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'

import { useSnackBar } from '@/context/Snackbar/hooks'
import styled from '@emotion/styled'
import { authStore } from '@/store/meStore'
import { startLogging } from '@/utils/network/logging'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { courseCartStore } from '@/store'
import { Analytics } from '@/context/analytics/components/Analytics'
import { SNACKBAR_BUTTON } from '@/context/analytics/components/const'
import { AppProvider } from '@/context/AppProvider'
import { useDisclosure } from '@/context/ShoppingCartModal/hooks'
import { TrackPageChange } from '@/components/TrackPageChange'
import { LoadingProgress } from '@/components/LoadingProgress'
import { StudyProgramEnum } from '@thinc-org/chula-courses'

mobxConfiguration()

const ToastAlert = styled(Alert)`
  div:last-child {
    padding: ${({ theme }) => theme.spacing(0, 0, 0, 2)};
  }
`

function MyApp({ Component, pageProps, forceDark, router }: AppProps) {
  useApp()

  // Retoring AuthStore and Syncing coursecart
  useEffect(() => {
    if (typeof window === 'undefined') return //Don't sync on the server

    reaction(
      () => ({
        isLoggedIn: authStore.isLoggedIn,
        cart: [...courseCartStore.shopItems],
        cartInitLocal: courseCartStore.isInitializedLocal,
      }),
      (d) => {
        syncWithLocalStorage(d.cart, d.cartInitLocal, !d.isLoggedIn)
      },
      { fireImmediately: true, delay: 1000 }
    )

    authStore.tryRestoreWithLocalStorage()
  }, [])

  useEffect(startLogging, [])

  useEffect(() => {
    const studyProgram = router.query.studyProgram as string
    if (studyProgram && !(Object.values(StudyProgramEnum) as string[]).includes(studyProgram)) {
      router.replace('/')
    }
    // eslint-disable-next-line
  }, [router.query])

  const { message, emitMessage, action: actionText, open, close, messageType } = useSnackBar()
  const disclosureValue = useDisclosure()
  const handleClose = (_: unknown, reason: string) => {
    if (reason === 'clickaway') {
      return
    }

    close()
  }

  const value = { handleClose, message, emitMessage, action: actionText }

  const [gapiLoaded, setGapiLoaded] = useState(false)

  const gapiCallback = useCallback(() => {
    if (gapiLoaded) {
      console.log('[GAPI] Repeated initilization attempt detected')
      return
    }
    console.log('[GAPI] Script loaded')
    setGapiLoaded(true)
    setupGAPI()
      .then(startGDriveSync)
      .catch((e) => {
        console.error('[GDRIVE] Error while starting drive sync', e)
        runInAction(() => {
          gDriveStore.gDriveState = GDriveSyncState.FAIL
        })
      })
  }, [gapiLoaded])
  if (typeof window !== 'undefined' && !gapiLoaded) {
    (window as any).gapiInit = gapiCallback
  }

  return (
    <>
      <Head>
        <title>CU Get Reg</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        {!gapiLoaded && <script async defer src={'https://apis.google.com/js/api.js?onload=gapiInit'} />}
      </Head>
      <AppProvider disclosureValue={disclosureValue} snackBarContextValue={value} forceDark={forceDark}>
        <TrackPageChange>
          <LoadingProgress />
          <CssBaseline />
          <TopBar />
          <Container>
            <ErrorBoundary>
              <Component {...pageProps} />
            </ErrorBoundary>
          </Container>
          <Footer />
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            onClose={handleClose}
            autoHideDuration={3000}
            open={open}
            style={{ top: '60px' }}
          >
            <ToastAlert
              severity={messageType}
              action={
                actionText ? (
                  <Analytics elementName={SNACKBAR_BUTTON}>
                    {({ log }) => (
                      <Button
                        size="small"
                        color="inherit"
                        onClick={() => {
                          log(null, message)
                          close()
                          disclosureValue.onOpen()
                        }}
                      >
                        {actionText}
                      </Button>
                    )}
                  </Analytics>
                ) : null
              }
            >
              {message}
            </ToastAlert>
          </Snackbar>
          <ShoppingCartModal />
        </TrackPageChange>
      </AppProvider>
    </>
  )
}

export default MyApp
