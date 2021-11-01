import { useMediaQuery, useTheme, Stack } from '@material-ui/core'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useTranslation } from 'react-i18next'

import bigLogo from '@/assets/images/cgrLogoLight.svg'
import github from '@/assets/images/github.svg'
import thincLogo from '@/assets/images/thincLogo.svg'

import { BannerContainer, PrivacyLink, GithubLink, BannerSubtitle, ResponsiveStack, StyledDivider } from './styled'

export function Banner() {
  const { t } = useTranslation('footer')
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))

  const showGithub = false

  return (
    <BannerContainer spacing={matches ? 1 : 3}>
      <Link href="/">
        <Image src={bigLogo} width="172" height={matches ? '40' : '56'} />
      </Link>

      <ResponsiveStack alignItems="center" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <a href="https://www.facebook.com/ThailandIncubator">
            <Image src={thincLogo} width="78" height="32" />
          </a>
          <BannerSubtitle>{t('university')}</BannerSubtitle>
        </Stack>
        {showGithub && (
          <>
            <StyledDivider orientation={matches ? 'horizontal' : 'vertical'} />
            <Link href="https://github.com/thinc-org">
              <GithubLink direction="row" alignItems="center">
                <BannerSubtitle>{t('github')}</BannerSubtitle>
                <Image src={github} width="20" height="20" />
              </GithubLink>
            </Link>
          </>
        )}
      </ResponsiveStack>
      <Link href="/privacy">
        <PrivacyLink>Privacy Policy</PrivacyLink>
      </Link>
    </BannerContainer>
  )
}
