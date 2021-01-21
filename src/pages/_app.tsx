import { useEffect } from 'react'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { ThemeProvider, CssBaseline, useMediaQuery } from '@material-ui/core'
import Head from 'next/head'

import '@/styles/globals.css'
import { darkTheme, lightTheme } from '@/utils/theme'

function removeElement(id: string) {
  const element = document.getElementById(id)
  element?.parentElement?.removeChild(element)
}

function MyApp({ Component, pageProps, forceDark }: AppProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  })

  useEffect(() => {
    removeElement('jss-server-side')
    removeElement('cgr-dark')
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
      <ThemeProvider
        theme={prefersDarkMode || forceDark ? darkTheme : lightTheme}
      >
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
