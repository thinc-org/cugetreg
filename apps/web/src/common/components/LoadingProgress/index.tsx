import { useEffect } from 'react'

import { GlobalStyles, css, useTheme } from '@mui/material'
import { Router } from 'next/router'
import nprogress from 'nprogress'

let startTimeout: NodeJS.Timeout | null = null

export function LoadingProgress() {
  const theme = useTheme()
  const height = 3
  const load = () => {
    if (startTimeout === null) {
      startTimeout = setTimeout(() => {
        startTimeout = null
        nprogress.start()
      }, 300)
    }
  }

  const stop = () => {
    if (startTimeout !== null) {
      clearTimeout(startTimeout)
      startTimeout = null
    }
    nprogress.done()
  }

  useEffect(() => {
    nprogress.configure({ showSpinner: false })
    Router.events.on('routeChangeStart', load)
    Router.events.on('routeChangeComplete', stop)
    Router.events.on('routeChangeError', stop)
    return () => stop()
  }, [])

  const cssCode = css`
    #nprogress {
      pointer-events: none;
    }
    #nprogress .bar {
      background: ${theme.palette.secondary.main};
      position: fixed;
      z-index: 1031;
      top: 0;
      left: 0;
      width: 100%;
      height: ${height}px;
    }
    #nprogress .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px ${theme.palette.secondary.main}, 0 0 5px ${theme.palette.secondary.main};
      opacity: 1;
      -webkit-transform: rotate(3deg) translate(0px, -4px);
      -ms-transform: rotate(3deg) translate(0px, -4px);
      transform: rotate(3deg) translate(0px, -4px);
    }
    .nprogress-custom-parent {
      overflow: hidden;
      position: relative;
    }
    .nprogress-custom-parent #nprogress .bar {
      position: absolute;
    }
  `

  return <GlobalStyles styles={cssCode} />
}
