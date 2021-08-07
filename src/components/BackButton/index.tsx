import styled from '@emotion/styled'
import { Button, IconButton } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useRouter } from 'next/router'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/context/analytics/components/Analytics'
import { GO_BACK_BUTTON } from '@/context/analytics/components/const'

const ButtonMobile = styled(IconButton)`
  border: 1px solid #2a2d48;
  box-sizing: border-box;
  border-radius: 4px;
  text-align: right;
  padding: 5px 8px;
  color: ${({ theme }) => theme.palette.primaryRange[400]};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    display: none;
  }
`

const ButtonDesktop = styled(Button)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

interface BackButtonProps {
  href: string
  pathId?: string
}

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
