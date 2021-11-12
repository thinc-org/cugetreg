import { Stack } from '@material-ui/core'
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

  return (
    <BannerContainer spacing={[1, 3]}>
      <Link href="/">
        <Image src={bigLogo} width="172.75" height="56.31" />
      </Link>

      <ResponsiveStack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <a href="https://www.facebook.com/ThailandIncubator" style={{ height: 35 }}>
            <Image src={thincLogo} width="78" height="32" />
          </a>
          <BannerSubtitle>{t('university')}</BannerSubtitle>
        </Stack>
        <StyledDivider orientation={'vertical'} />
        <GithubLink href="https://github.com/thinc-org">
          <BannerSubtitle>{t('github')}</BannerSubtitle>
          <Image src={github} width="20" height="20" />
        </GithubLink>
      </ResponsiveStack>
      <Link href="/privacy" passHref>
        <PrivacyLink>Privacy Policy</PrivacyLink>
      </Link>
    </BannerContainer>
  )
}
