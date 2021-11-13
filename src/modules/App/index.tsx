import { EmotionCache } from '@emotion/utils'
import { CssBaseline } from '@mui/material'
import { Container } from '@mui/material'
import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/dist/next-server/lib/router/router'

import { Footer } from '@/common/components/Footer'
import { LoadingProgress } from '@/common/components/LoadingProgress'
import { TopBar } from '@/common/components/TopBar'
import { useSaveStudyProgram } from '@/common/hooks/useCourseGroup'
import '@/common/i18n'
import { TrackPageChange } from '@/common/tracker/components/TrackPageChange'
import { createEmotionCache } from '@/configs/createEmotionCache'
import { mobxConfiguration } from '@/configs/mobx'
import { AppProvider } from '@/modules/App/context'
import { ShoppingCartModal } from '@/modules/CourseSearch/components/ShoppingCartModal'
import { ErrorBoundary } from '@/modules/ErrorBoundary'

import SEO from '../../../next-seo.config'
import { CourseSnackbar } from './components/CourseSnackbar'
import { useApp } from './hooks/useApp'

mobxConfiguration()

const clientSideEmotionCache = createEmotionCache()
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export function App(props: MyAppProps) {
  const { Component, pageProps, forceDark, router, emotionCache = clientSideEmotionCache } = props
  useApp(router)
  useSaveStudyProgram()

  return (
    <>
      <DefaultSeo {...SEO} />
      <AppProvider forceDark={forceDark} emotionCache={emotionCache}>
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
