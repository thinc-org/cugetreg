import { Divider, makeStyles, useMediaQuery, useTheme, Stack } from '@material-ui/core'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

import bigLogo from '@/assets/images/cgrLogoLight.svg'
import github from '@/assets/images/github.svg'
import thincLogo from '@/assets/images/thincLogo.svg'

import { BannerContainer, PrivacyLink, GithubLink, BannerSubtitle } from './styled'

const useStyles = makeStyles((theme) => ({
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

  const showGithub = true

  const rowOrColumns = matches ? 'column' : 'row'

  return (
    <BannerContainer spacing={matches ? 1 : 3}>
      <Link href="/">
        <Image src={bigLogo} width="172" height={matches ? '40' : '56'} />
      </Link>

      <Stack direction={rowOrColumns} alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <a href="https://www.facebook.com/ThailandIncubator">
            <Image src={thincLogo} width="78" height="32" />
          </a>
          <BannerSubtitle>{t('footer:university')}</BannerSubtitle>
        </Stack>
        {showGithub && (
          <>
            <Divider orientation={matches ? 'horizontal' : 'vertical'} className={classes.divider} />
            <Link href="https://github.com/thinc-org">
              <GithubLink direction="row" alignItems="center">
                <BannerSubtitle>{t('footer:github')}</BannerSubtitle>
                <Image src={github} width="20" height="20" />
              </GithubLink>
            </Link>
          </>
        )}
      </Stack>
      <Link href="/privacy">
        <PrivacyLink>Privacy Policy</PrivacyLink>
      </Link>
    </BannerContainer>
  )
}
