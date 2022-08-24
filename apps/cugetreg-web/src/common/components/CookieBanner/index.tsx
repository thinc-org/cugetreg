import { Button, Link as MuiLink, Stack, Typography } from '@mui/material'
import Link from 'next/link'

import { ConsentMode } from '@web/common/constants/consents'
import { useConsentsStore } from '@web/store/consents'

import { Consents } from '../../types/consents'
import { CookieSettings } from './components/CookieSettings'
import { Container, FixedContainer } from './styled'

export const CookieBanner = () => {
  const {
    consents,
    bannerOpen,
    settingsOpen,
    setBannerOpen,
    setSettingsOpen,
    setConsents,
    submitConsents,
  } = useConsentsStore()

  const setConsentsSetting = (newConsents: Consents) => {
    setConsents(newConsents)
  }

  const handleOpenSettings = () => {
    setSettingsOpen(true)
  }

  const handleCloseSettings = () => {
    setBannerOpen(false)
    setSettingsOpen(false)
  }

  const handleConsentAll = () => {
    const selectedConsents: Consents = {
      // [ConsentMode.AD_STORAGE]: true,
      [ConsentMode.ANALYTICS_STORAGE]: true,
    }
    setConsents(selectedConsents)
    submitConsents(selectedConsents)
    setBannerOpen(false)
  }

  return (
    <>
      {bannerOpen && (
        <FixedContainer>
          <Container>
            <Typography variant="body1" mb={2}>
              เราใช้คุกกี้เพื่อพัฒนาประสิทธิภาพ และประสบการณ์ที่ดีในการใช้เว็บไซต์ของคุณ
              คุณสามารถศึกษารายละเอียดได้ที่{' '}
              <Link href="/privacy" passHref>
                <MuiLink sx={{ textDecoration: 'underline' }}>นโยบายความเป็นส่วนตัว</MuiLink>
              </Link>{' '}
              และสามารถจัดการความเป็นส่วนตัวเองได้ของคุณได้เองโดยคลิกที่ตั้งค่า
            </Typography>
            <Stack direction="row" gap={2}>
              <Button onClick={handleOpenSettings} variant="outlined" fullWidth>
                ตั้งค่า
              </Button>
              <Button onClick={handleConsentAll} variant="contained" fullWidth>
                ยืนยัน
              </Button>
            </Stack>
          </Container>
        </FixedContainer>
      )}
      <CookieSettings
        open={settingsOpen}
        onClose={handleCloseSettings}
        consents={consents}
        setConsents={setConsentsSetting}
        submitConsents={submitConsents}
      />
    </>
  )
}
