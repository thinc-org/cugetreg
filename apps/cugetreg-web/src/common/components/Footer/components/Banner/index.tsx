import React from 'react'
import { useTranslation } from 'react-i18next'

import { Stack } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

import { useConsentsStore } from '@web/store/consents'

import {
  BannerContainer,
  BannerSubtitle,
  CookieSetting,
  GithubLink,
  PrivacyLink,
  ResponsiveStack,
  StyledDivider,
} from './styled'

export function Banner() {
  const { t } = useTranslation('footer')
  const { setOpenSettings } = useConsentsStore()

  return (
    <BannerContainer spacing={[1, 3]}>
      <Link href="/">
        <Image src="/images/cgrLogoLight.svg" width="172.75" height="56.31" alt="" />
      </Link>

      <ResponsiveStack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <a href="https://www.facebook.com/ThailandIncubator" style={{ height: 35 }}>
            <Image src="/images/thincLogo.svg" width="78" height="32" alt="" />
          </a>
          <BannerSubtitle>{t('university')}</BannerSubtitle>
        </Stack>
        <StyledDivider orientation={'vertical'} />
        <GithubLink href="https://github.com/thinc-org">
          <BannerSubtitle>{t('github')}</BannerSubtitle>
          <Image src="/images/github.svg" width="20" height="20" alt="" />
        </GithubLink>
      </ResponsiveStack>
      <Stack gap={2} direction="row">
        <Link href="/privacy" passHref>
          <PrivacyLink>Privacy Policy</PrivacyLink>
        </Link>
        <CookieSetting onClick={() => setOpenSettings(true)}>Privacy Preferences</CookieSetting>
      </Stack>
    </BannerContainer>
  )
}
