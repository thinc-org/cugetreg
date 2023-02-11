import type { AppProps } from 'next/app'
import { AppProvider } from '@admin-web/context/AppProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  )
}
