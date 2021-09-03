import { CssBaseline, Button, Snackbar } from '@material-ui/core'
import { Container } from '@material-ui/core'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import Head from 'next/head'

import { Footer } from '@/common/components/Footer'
import { LoadingProgress } from '@/common/components/LoadingProgress'
import { TopBar } from '@/common/components/TopBar'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { SNACKBAR_BUTTON } from '@/common/context/Analytics/constants'
import { useDisclosure } from '@/common/hooks/useDisclosure'
import '@/common/i18n'
import { TrackPageChange } from '@/common/tracker/components/TrackPageChange'
import { mobxConfiguration } from '@/configs/mobx'
import { AppProvider } from '@/modules/App/context'
import { ShoppingCartModal } from '@/modules/CourseSearch/components/ShoppingCartModal'
import { ErrorBoundary } from '@/modules/ErrorBoundary'

import { useApp } from './hooks/useApp'
import { ToastAlert } from './styled'

mobxConfiguration()

function App({ Component, pageProps, forceDark, router }: AppProps) {
  const value = useApp(router)
  const disclosureValue = useDisclosure()

  const { message, open, handleClose, messageType, actionText } = value

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

export default App
