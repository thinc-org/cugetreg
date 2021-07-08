import { Divider, makeStyles, useMediaQuery, useTheme } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import bigLogo from '@/assets/images/cgrLogoLight.svg'
import thincLogo from '@/assets/images/thincLogo.svg'
import github from '@/assets/images/github.svg'
import { FlexContainer } from '../FlexContainer'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  banner: {
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  bannerDetail: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  smallRow: {
    flexGrow: 0,
    width: 'auto',
    padding: theme.spacing(0),
    margin: theme.spacing(0),
    justifyContent: 'flex-end',
  },
  bannerSubtitle: {
    ...theme.typography.subtitle1,
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(0, 2),
    },
  },
  divider: {
    background: theme.palette.primary.contrastText,
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 0),
      width: '90%',
    },
  },
  logo: {
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(2),
    },
  },
  bigLogo: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2),
      maxWidth: '60%',
    },
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing(4),
    },
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
  const theme = useTheme()
  const classes = useStyles()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <FlexContainer className={classes.banner}>
      <Link href="/">
        <img src={bigLogo} className={classes.bigLogo} height={matches ? '40' : '56'} />
      </Link>

      <FlexContainer className={classes.bannerDetail}>
        <FlexContainer className={classes.smallRow}>
          <img src={thincLogo} />
          <div className={classes.bannerSubtitle}>{t('footer:university')}</div>
        </FlexContainer>
        {/* <Divider orientation={matches ? 'horizontal' : 'vertical'} className={classes.divider} />
        <Link href="https://github.com/thinc-org">
          <a className={classes.link}>
            <div className={classes.bannerSubtitle}>{t('footer:github')}</div>
            <img className={classes.logo} src={github} />
          </a>
        </Link> */}
      </FlexContainer>
      <FlexContainer className={classes.smallRow}>
        <Link href="/privacy">
          <a className={classes.link}>Privacy Policy</a>
        </Link>
      </FlexContainer>
    </FlexContainer>
  )
}
