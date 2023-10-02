import React from 'react'

import createEmotionServer from '@emotion/server/create-instance'
import Document, { Head, Html, Main, NextScript } from 'next/document'

import { createEmotionCache } from '@web/configs/createEmotionCache'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;700&display=swap"
            as="style"
          />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
            as="style"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;700&display=swap"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
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

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage

  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enhanceApp: (App: any) => (props) => <App emotionCache={cache} {...props} />,
    })

  const initialProps = await Document.getInitialProps(ctx)

  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
  }
}

/**
 * Migrating to MUIv5:
 * Commented since we don't have dark theme
 */
// MyDocument.getInitialProps = async (ctx: DocumentContext) => {
//   const sheets = new ServerStyleSheets()
//   const darkSheets = new ServerStyleSheets()
//   const originalRenderPage = ctx.renderPage
//   const injectDarkTheme = env.features.darkTheme && env.isProduction

//   ctx.renderPage = () => {
//     resetServerContext()
//     if (injectDarkTheme) {
//       originalRenderPage({
//         enhanceApp: (App) => (props) => darkSheets.collect(<App {...{ forceDark: true }} {...props} />),
//       })
//     }
//     return originalRenderPage({
//       enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
//     })
//   }

//   const initialProps = await Document.getInitialProps(ctx)
//   let styleElement: ReactNode
//   if (injectDarkTheme) {
//     const lightStyle = sheets.toString()
//     const darkStyle = darkSheets.toString()
//     styleElement = injectDarkStyle(lightStyle, darkStyle)
//   } else {
//     styleElement = (
//       <>
//         {sheets.getStyleElement()}
//         {/* Prevent FOUC */}
//         <script dangerouslySetInnerHTML={{ __html: '(function() {})()' }} />
//       </>
//     )
//   }

//   return {
//     ...initialProps,
//     styles: [...React.Children.toArray(initialProps.styles), styleElement],
//   }
// }
