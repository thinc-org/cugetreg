import { useId, useRef } from 'react'
import Script from 'next/script'
import { observer } from 'mobx-react'

import { useGoogleOneTap } from './hooks/useGoogleOneTap'
import { OneTapPrompt, OneTapPromptContainer } from './styled'

export const GoogleOneTapPrompt = observer(function GoogleOneTapPrompt() {
  const promptRef = useRef<HTMLDivElement>(null)
  const promptId = useId()
  useGoogleOneTap(promptRef)

  return (
    <OneTapPromptContainer>
      <OneTapPrompt id={promptId} ref={promptRef} />
      <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
    </OneTapPromptContainer>
  )
})
