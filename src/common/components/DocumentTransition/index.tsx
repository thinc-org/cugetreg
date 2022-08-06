/* eslint-disable no-inner-declarations */
import { AppProps } from 'next/dist/next-server/lib/router/router'

import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

export type DocumentTransitionProps = Pick<AppProps, 'Component' | 'pageProps'>
type State = DocumentTransitionProps

interface ITransition {
  start(cb: () => void): Promise<void>
}

interface IDocument extends Document {
  createDocumentTransition?: () => ITransition
}

export function DocumentTransition({ Component, pageProps }: DocumentTransitionProps) {
  const [state, setState] = useState<State>({ Component, pageProps })
  const nextStateRef = useRef(state)
  const nextTransitionIsBack = useRef(false)

  useEffect(() => {
    const navigation = window.navigation
    function onNavigate(navigateEvent: any) {
      if (navigateEvent.userInitiated) {
        nextTransitionIsBack.current = isBackNavigation(navigateEvent)
      }
    }
    navigation.addEventListener('navigate', onNavigate)
    return () => {
      navigation.removeEventListener('navigate', onNavigate)
    }
  })

  useEffect(() => {
    async function commit() {
      const nextState = { Component, pageProps }
      const _document = document as IDocument

      if (!_document.createDocumentTransition) {
        return setState(nextState)
      }
      nextStateRef.current = nextState
      if (nextTransitionIsBack.current) {
        nextTransitionIsBack.current = false
        document.documentElement.classList.add('back-transition')
      }
      let transition: ITransition | null
      try {
        transition = _document.createDocumentTransition()
      } catch (e) {
        transition = null
      }
      if (transition) {
        await transition.start(() => {
          flushSync(() => setState(nextStateRef.current))
        })
      } else {
        setState(nextStateRef.current)
      }
      document.documentElement.classList.remove('back-transition')
    }
    commit()
  }, [Component, pageProps])

  return <state.Component {...state.pageProps} />
}

function isBackNavigation(navigateEvent) {
  if (navigateEvent.navigationType === 'push' || navigateEvent.navigationType === 'replace') {
    return false
  }
  if (navigateEvent.destination.index !== -1 && navigateEvent.destination.index < navigation.currentEntry.index) {
    return true
  }
  return false
}
