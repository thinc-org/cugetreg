import { useEffect, useState } from 'react'
import nprogress from 'nprogress'
import { Router } from 'next/router'
import { useTheme } from '@material-ui/core'

export function LoadingProgress() {
  const theme = useTheme()
  const height = 3
  const load = () => {
    nprogress.start()
  }

  const stop = () => {
    nprogress.done()
  }

  useEffect(() => {
    nprogress.configure({ showSpinner: false })
    load()
    setTimeout(() => {
      stop()
    }, 500)
    Router.events.on('routeChangeStart', load)
    Router.events.on('routeChangeComplete', stop)
    Router.events.on('routeChangeError', stop)
  }, [])

  return (
    <style jsx global>{`
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
    `}</style>
  )
}
