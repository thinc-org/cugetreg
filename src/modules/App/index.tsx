import { CssBaseline } from '@material-ui/core'
import { Container } from '@material-ui/core'
import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/dist/next-server/lib/router/router'

import { Footer } from '@/common/components/Footer'
import { LoadingProgress } from '@/common/components/LoadingProgress'
import { TopBar } from '@/common/components/TopBar'
import '@/common/i18n'
import { TrackPageChange } from '@/common/tracker/components/TrackPageChange'
import { mobxConfiguration } from '@/configs/mobx'
import { AppProvider } from '@/modules/App/context'
import { ShoppingCartModal } from '@/modules/CourseSearch/components/ShoppingCartModal'
import { ErrorBoundary } from '@/modules/ErrorBoundary'

import SEO from '../../../next-seo.config'
import { CourseSnackbar } from './components/CourseSnackbar'
import { useApp } from './hooks/useApp'

mobxConfiguration()

export function App({ Component, pageProps, forceDark, router }: AppProps) {
  useApp(router)

  return (
    <>
      <DefaultSeo {...SEO} />
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
