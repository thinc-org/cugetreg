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
        <Toaster position="top-center" reverseOrder={false} toastOptions={toastConfig} />
      </Layout>
    </AppProvider>
  )
}

export const toastConfig = {
  style: {
    fontFamily: "'JetBrains Mono','IBM Plex Sans Thai','monospace'",
    fontWeight: '700',
  },
  success: {
    style: {
      background: '#D1FAE5',
    },
  },
  error: {
    style: {
      background: '#FEE2E2',
    },
  },
}
