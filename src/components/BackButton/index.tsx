import React from 'react'
import styled from '@emotion/styled'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useTranslation } from 'react-i18next'
import { Button, IconButton } from '@material-ui/core'
import LinkType from 'next/link'
import { Analytics } from '@/context/analytics/components/Analytics'
import { GO_BACK_BUTTON } from '@/context/analytics/components/const'
import { useRouter } from 'next/router'

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

export function WithButton(Link: typeof LinkType) {
  const router = useRouter()
  const { t } = useTranslation('navigation')

  return (props: BackButtonProps) => {
    const redirectToPreviousPage = (log: (_?: unknown, value?: string) => void) => (...args: any) => {
      log(args)
      router.back()
    }

    return (
      <>
        <Analytics elementName={GO_BACK_BUTTON} pathId={props.pathId}>
          {({ log }) => (
            <Link passHref href={props.href}>
              <ButtonDesktop
                href={props.href}
                onClick={redirectToPreviousPage(log)}
                startIcon={<ArrowBackIosIcon />}
                color="primary"
                variant="outlined"
                disableElevation
              >
                {t('back')}
              </ButtonDesktop>
            </Link>
          )}
        </Analytics>
        <Analytics elementName={GO_BACK_BUTTON} pathId={props.pathId}>
          {({ log }) => (
            <Link passHref href={props.href}>
              <ButtonMobile onClick={redirectToPreviousPage(log)} aria-label="back">
                <ArrowBackIosIcon />
              </ButtonMobile>
            </Link>
          )}
        </Analytics>
      </>
    )
  }
}
