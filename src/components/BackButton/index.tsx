import React from 'react'
import styled from '@emotion/styled'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useTranslation } from 'react-i18next'
import { Button, IconButton } from '@material-ui/core'
import LinkType from 'next/link'
import { Analytics } from '@/components/Analytics'
import { GO_BACK_BUTTON } from '@/components/Analytics/const'

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
  onClick?: () => void
  href: string
  pathId?: string
}

export function WithButton(Link: typeof LinkType) {
  const { t } = useTranslation('navigation')
  return (props: BackButtonProps) => {
    return (
      <>
        <Analytics elementName={GO_BACK_BUTTON} pathId={props.pathId}>
          {({ log }) => (
            <Link passHref href={props.href}>
              <ButtonDesktop
                {...props}
                onClick={log}
                startIcon={<ArrowBackIosIcon />}
                color="primary"
                variant="outlined"
                disableElevation
              >
                {t('back')}
              </ButtonDesktop>
            </Link>
          )}
        </Analytics>{' '}
        <Analytics elementName={GO_BACK_BUTTON}>
          {({ log }) => (
            <Link passHref href={props.href}>
              <ButtonMobile onClick={log} aria-label="back">
                <ArrowBackIosIcon />
              </ButtonMobile>
            </Link>
          )}
        </Analytics>
      </>
    )
  }
}
