import React, { useContext } from 'react'
import styled from '@emotion/styled'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useTranslation } from 'react-i18next'
import { Button, IconButton } from '@material-ui/core'
import { GO_BACK_BUTTON } from '@/context/analytics/components/const'
import { HistoryContext } from '@/context/History'
import { LinkWithAnalytics } from '@/context/analytics/components/LinkWithAnalytics'

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

export function BackButton(props: BackButtonProps) {
  const { t } = useTranslation('navigation')

  const { histories } = useContext(HistoryContext)

  const href = histories.length <= 2 ? props.href : histories[1]

  return (
    <>
      <LinkWithAnalytics passHref href={href} elementName={GO_BACK_BUTTON} pathId={props.pathId}>
        <ButtonDesktop href={href} startIcon={<ArrowBackIosIcon />} color="primary" variant="outlined" disableElevation>
          {t('back')}
        </ButtonDesktop>
      </LinkWithAnalytics>
      <LinkWithAnalytics passHref href={href} elementName={GO_BACK_BUTTON} pathId={props.pathId}>
        <ButtonMobile aria-label="back">
          <ArrowBackIosIcon />
        </ButtonMobile>
      </LinkWithAnalytics>
    </>
  )
}
