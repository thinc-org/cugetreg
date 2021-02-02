import { Divider, makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import whiteLogo from '@/assets/images/whiteLogo.svg'
import thincLogo from '@/assets/images/thincLogo.svg'
import github from '@/assets/images/github.svg'
import { FlexContainer } from '../FlexContainer'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  banner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
  logo: {
    // Extend horizontal hit target
    marginLeft: -16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  bannerDetail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerSubtitle: {
    ...theme.typography.subtitle1,
    margin: '0px 16px',
  },
  divider: {
    background: theme.palette.primary.contrastText,
    margin: '0px 8px',
  },
  link: {
    display: 'flex',
    flexDirection: 'row',
    textDecoration: 'none',
    color: 'inherit',
  },
}))

export function Banner() {
  const { t } = useTranslation()
  const classes = useStyles()
  return (
    <FlexContainer className={classes.banner}>
      <Link href="/">
        <img src={whiteLogo} />
      </Link>

      <div className={classes.bannerDetail}>
        <img src={thincLogo} />
        <div className={classes.bannerSubtitle}>{t('footer:university')}</div>
        <Divider orientation="vertical" flexItem className={classes.divider} />
        <Link href="https://github.com/thinc-org">
          <a className={classes.link}>
            <div className={classes.bannerSubtitle}>{t('footer:github')}</div>
            <img src={github} />
          </a>
        </Link>
      </div>
    </FlexContainer>
  )
}
