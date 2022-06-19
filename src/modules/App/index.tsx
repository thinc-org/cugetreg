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
import { CustomToaster } from '@/modules/App/components/CustomToaster'
import { AppProvider } from '@/modules/App/context'
import { HackPDPAForm } from '@/modules/CourseSearch/components/HackConsentForm'
import { ShoppingCartModal } from '@/modules/CourseSearch/components/ShoppingCartModal'
import { ErrorBoundary } from '@/modules/ErrorBoundary'

import SEO from '../../../next-seo.config'
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
        <HackPDPAForm />
        <CustomToaster />
      </TrackPageChange>
    </AppProvider>
  )
}
