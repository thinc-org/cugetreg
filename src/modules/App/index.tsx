import { EmotionCache } from '@emotion/utils'
import { CssBaseline } from '@mui/material'
import { Container } from '@mui/material'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Script from 'next/script'

import { AnnouncementBar } from '@/common/components/AnnouncementBar'
import { Footer } from '@/common/components/Footer'
import { LoadingProgress } from '@/common/components/LoadingProgress'
import { TopBar } from '@/common/components/TopBar'
import { useSaveStudyProgram } from '@/common/hooks/useCourseGroup'
import '@/common/i18n'
import { TrackPageChange } from '@/common/tracker/components/TrackPageChange'
import { createEmotionCache } from '@/configs/createEmotionCache'
import { mobxConfiguration } from '@/configs/mobx'
import { GOOGLE_TAG_MANAGER_CONTAINER_ID } from '@/env'
import { CustomToaster } from '@/modules/App/components/CustomToaster'
import { AppProvider } from '@/modules/App/context'
import { ShoppingCartModal } from '@/modules/CourseSearch/components/ShoppingCartModal'
import { ErrorBoundary } from '@/modules/ErrorBoundary'

import SEO from '../../../next-seo.config'
import { useApp } from './hooks/useApp'

mobxConfiguration()

const clientSideEmotionCache = createEmotionCache()
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  forceDark: boolean
}

export function App({ Component, pageProps, forceDark, router, emotionCache = clientSideEmotionCache }: MyAppProps) {
  useApp(router)
  useSaveStudyProgram()

  return (
    <AppProvider forceDark={forceDark} emotionCache={emotionCache} pageProps={pageProps}>
      <TrackPageChange>
        <DefaultSeo {...SEO} />
        <LoadingProgress />
        <CssBaseline />
        <TopBar />
        <AnnouncementBar />
        <Container sx={{ display: 'flex', flexGrow: 1, my: 2, '& > *': { flexGrow: 1 } }}>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </Container>
        <Footer />
        <ShoppingCartModal />
        <CustomToaster />
      </TrackPageChange>
      <Script
        strategy="afterInteractive"
        id="your-id"
        dangerouslySetInnerHTML={{
          __html: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', '${GOOGLE_TAG_MANAGER_CONTAINER_ID}');
  `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_CONTAINER_ID}"`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </AppProvider>
  )
}
