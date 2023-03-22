import type { AppProps } from 'next/app'
import { AppProvider } from '@admin-web/context/AppProvider'
import '@admin-web/styles/globals.css'
import { Layout } from '@admin-web/common/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  )
}
