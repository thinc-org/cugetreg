import React, { ReactNode } from 'react'
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'
import environment from '@/utils/environment'
import { injectDarkStyle } from '@/utils/darkStyleInjector'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
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

  ctx.renderPage = () => {
    if (environment.production) {
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          darkSheets.collect(<App {...{ forceDark: true }} {...props} />),
      })
    }
    return originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })
  }

  const initialProps = await Document.getInitialProps(ctx)
  let styleElement: ReactNode
  if (environment.production) {
    const lightStyle = sheets.toString()
    const darkStyle = darkSheets.toString()
    styleElement = injectDarkStyle(lightStyle, darkStyle)
  } else {
    styleElement = sheets.getStyleElement()
  }

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), styleElement],
  }
}
