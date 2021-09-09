import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { GO_BACK_BUTTON } from '@/common/context/Analytics/constants'

import { ButtonDesktop, ButtonMobile } from './styled'
import { BackButtonProps } from './types'

export function BackButton({ href, pathId }: BackButtonProps) {
  const { t } = useTranslation('navigation')
  const router = useRouter()

  const onClick = useCallback(() => {
    router.events.on('routeChangeStart', resetTimeout)
    router.back()

    const timeout = setTimeout(() => {
      router.push(href)
    }, 10)

    function resetTimeout() {
      router.events.off('routeChangeStart', resetTimeout)
      clearTimeout(timeout)
    }
  }, [router, href])

  return (
    <>
      <Analytics elementName={GO_BACK_BUTTON} pathId={pathId}>
        <ButtonDesktop
          onClick={onClick}
          startIcon={<ArrowBackIosIcon />}
          color="primary"
          variant="outlined"
          disableElevation
        >
          {t('back')}
        </ButtonDesktop>
      </Analytics>
      <Analytics elementName={GO_BACK_BUTTON} pathId={pathId}>
        <ButtonMobile onClick={onClick} aria-label="back">
          <ArrowBackIosIcon />
        </ButtonMobile>
      </Analytics>
    </>
  )
}
