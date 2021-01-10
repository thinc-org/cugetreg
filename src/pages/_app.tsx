import { useEffect } from 'react'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import Head from 'next/head'

import '../styles/globals.css'
import { lightTheme } from '../utils/theme'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  })

  return (
    <>
      <Head>
        <title>CU Get Reg</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
