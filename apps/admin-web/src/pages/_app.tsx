import { Toaster } from 'react-hot-toast'

import type { AppProps } from 'next/app'

import { Layout } from '@admin-web/common/Layout'
import { AppProvider } from '@admin-web/context/AppProvider'
import '@admin-web/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
        <Toaster position="top-center" reverseOrder={false} />
      </Layout>
    </AppProvider>
  )
}
