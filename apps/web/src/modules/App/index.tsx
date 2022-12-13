import { EmotionCache } from '@emotion/utils'
import { CssBaseline } from '@mui/material'
import { Container } from '@mui/material'
import { DefaultSeo } from 'next-seo'
import { AppProps } from 'next/app'
import dynamic from 'next/dynamic'

import { Footer } from '@web/common/components/Footer'
import { TopBar } from '@web/common/components/TopBar'
import { useSaveStudyProgram } from '@web/common/hooks/useCourseGroup'
import '@web/common/i18n'
import { TrackPageChange } from '@web/common/tracker/components/TrackPageChange'
import { createEmotionCache } from '@web/configs/createEmotionCache'
import { mobxConfiguration } from '@web/configs/mobx'
import { CustomToaster } from '@web/modules/App/components/CustomToaster'
import { AppProvider } from '@web/modules/App/context'
import { ShoppingCartModal } from '@web/modules/CourseSearch/components/ShoppingCartModal'
import { ErrorBoundary } from '@web/modules/ErrorBoundary'

import { LoadingProgress } from '@libs/react-ui'

import SEO from '../../../next-seo.config'
import { useApp } from './hooks/useApp'

const CookieBanner = dynamic(
  async () =>
    (
      await import(
        /* webpackChunkName: "CookieBanner" */
        '@web/common/components/CookieBanner'
      )
    ).CookieBanner,
  { ssr: false }
)

mobxConfiguration()

const clientSideEmotionCache = createEmotionCache()
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  forceDark?: boolean
}

export function App(props: MyAppProps) {
  const { Component, pageProps, forceDark, router, emotionCache = clientSideEmotionCache } = props
  useApp(router)
  useSaveStudyProgram()

  return (
    <AppProvider forceDark={forceDark} emotionCache={emotionCache}>
      <TrackPageChange>
        <DefaultSeo {...SEO} />
        <LoadingProgress />
        <CssBaseline />
        <TopBar />
        <Container>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </Container>
        <Footer />
        <ShoppingCartModal />
        <CustomToaster />
        <CookieBanner />
      </TrackPageChange>
    </AppProvider>
  )
}
