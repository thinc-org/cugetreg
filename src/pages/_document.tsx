import React, { ReactNode } from 'react'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'
import { injectDarkStyle } from '@/utils/darkStyleInjector'
import env from '@/utils/env/macro'
import { resetServerContext } from 'react-beautiful-dnd'

import { hotjar } from 'react-hotjar'
import { hotjar_clientid, hotjar_snippet_version } from '@/utils/env'

export default class MyDocument extends Document {
  componentDidMount() {
    hotjar.initialize(hotjar_clientid, hotjar_snippet_version)
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Prompt:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const sheets = new ServerStyleSheets()
  const darkSheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage
  const injectDarkTheme = env.features.darkTheme && env.isProduction

  ctx.renderPage = () => {
    resetServerContext()
    if (injectDarkTheme) {
      originalRenderPage({
        enhanceApp: (App) => (props) => darkSheets.collect(<App {...{ forceDark: true }} {...props} />),
      })
    }
    return originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })
  }

  const initialProps = await Document.getInitialProps(ctx)
  let styleElement: ReactNode
  if (injectDarkTheme) {
    const lightStyle = sheets.toString()
    const darkStyle = darkSheets.toString()
    styleElement = injectDarkStyle(lightStyle, darkStyle)
  } else {
    styleElement = (
      <>
        {sheets.getStyleElement()}
        {/* Prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: '(function() {})()' }} />
      </>
    )
  }

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), styleElement],
  }
}
