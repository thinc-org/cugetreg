import styled from '@emotion/styled'
import { CssBaseline, Button, Snackbar, Alert } from '@material-ui/core'
import { StudyProgramEnum } from '@thinc-org/chula-courses'
import { reaction } from 'mobx'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import Head from 'next/head'
import { useEffect } from 'react'

import { Footer } from '@/common/components/Footer'
import { LoadingProgress } from '@/common/components/LoadingProgress'
import { TopBar } from '@/common/components/TopBar'
import '@/common/i18n'
import Tracker from '@/common/tracker'
import { Container } from '@/components/Container'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ShoppingCartModal } from '@/components/ShoppingCartModal'
import { TrackPageChange } from '@/components/TrackPageChange'
import '@/configs/globalStyles/index.css'
import { mobxConfiguration } from '@/configs/mobx'
import { Analytics } from '@/context/Analytics/components/Analytics'
import { SNACKBAR_BUTTON } from '@/context/Analytics/components/const'
import { AppProvider } from '@/context/AppProvider'
import { useDisclosure } from '@/context/ShoppingCartModal/hooks'
import { useSnackBar } from '@/context/Snackbar/hooks'
import useApp from '@/hooks/useApp'
import { courseCartStore } from '@/store'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'
import { gapiStore } from '@/store/googleApiStore'
import { loadGapi } from '@/utils/googleapi'
import { syncWithLocalStorage } from '@/utils/localstorage'
import { startLogging } from '@/utils/network/logging'

mobxConfiguration()

const ToastAlert = styled(Alert)`
  div:last-child {
    padding: ${({ theme }) => theme.spacing(0, 0, 0, 2)};
  }
`

function MyApp({ Component, pageProps, forceDark, router }: AppProps) {
  useApp()

  useEffect(() => {
    Tracker.init()
  }, [])

  // Retoring AuthStore and Syncing coursecart
  useEffect(() => {
    if (typeof window === 'undefined') return //Don't sync on the server

    reaction(
      () => ({
        isLoggedIn: gapiStore.currentUser?.isSignedIn() && gDriveStore.gDriveState !== GDriveSyncState.NOGRANT,
        cart: [...courseCartStore.shopItems],
        cartInitLocal: courseCartStore.isInitializedLocal,
      }),
      (d) => {
        syncWithLocalStorage(d.cart, d.cartInitLocal, !d.isLoggedIn)
      },
      { fireImmediately: true, delay: 1000 }
    )
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

  //GAPI hook
  useEffect(() => {
    loadGapi()
  }, [])

  const value = { handleClose, message, emitMessage, action: actionText }

  return (
    <>
      <Head>
        <title>CU Get Reg</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
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
