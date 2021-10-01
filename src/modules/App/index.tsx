import { CssBaseline } from '@material-ui/core'
import { Container } from '@material-ui/core'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import Head from 'next/head'

import { Footer } from '@/common/components/Footer'
import { LoadingProgress } from '@/common/components/LoadingProgress'
import { TopBar } from '@/common/components/TopBar'
import '@/common/i18n'
import { TrackPageChange } from '@/common/tracker/components/TrackPageChange'
import { mobxConfiguration } from '@/configs/mobx'
import { AppProvider } from '@/modules/App/context'
import { ShoppingCartModal } from '@/modules/CourseSearch/components/ShoppingCartModal'
import { ErrorBoundary } from '@/modules/ErrorBoundary'

import { CourseSnackbar } from './components/CourseSnackbar'
import { useApp } from './hooks/useApp'

mobxConfiguration()

export function App({ Component, pageProps, forceDark, router }: AppProps) {
  useApp(router)

  return (
    <>
      <Head>
        <title>CU Get Reg</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <AppProvider forceDark={forceDark}>
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
          {/* TODO: refactor the snackbar */}
          <CourseSnackbar />
          {/* END OF TODO */}
          <ShoppingCartModal />
        </TrackPageChange>
      </AppProvider>
    </>
  )
}
