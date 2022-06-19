import { Button, Link as MuiLink, Stack, Typography } from '@mui/material'
import Link from 'next/link'

import { ConsentMode } from '@/common/constants/consents'
import { useConsentsStore } from '@/store/consents'

import { Consents } from '../../types/consents'
// import { CookieSettings } from './components/CookieSettings'
import { Container, FixedContainer } from './styled'

export const CookieBanner = () => {
  const { openBanner, setConsents, setOpenBanner } = useConsentsStore()

  // const setConsentsSetting = (newConsents: Consents) => {
  //   setConsents(newConsents)
  // }

  // const handleOpenSettings = () => {
  //   setOpenSettings(true)
  // }

  // const handleCloseSettings = () => {
  //   setOpenBanner(false)
  //   setOpenSettings(false)
  // }

  const handleConsentAll = () => {
    const selectedConsents: Consents = {
      [ConsentMode.AD_STORAGE]: true,
      [ConsentMode.ANALYTICS_STORAGE]: true,
      checked: true,
    }
    setConsents(selectedConsents)
    setOpenBanner(false)
  }

  return (
    <>
      {openBanner && (
        <FixedContainer>
          <Container>
            <Typography variant="body1" mb={2}>
              เราใช้คุกกี้เพื่อพัฒนาประสิทธิภาพ และประสบการณ์ที่ดีในการใช้เว็บไซต์ของคุณ คุณสามารถศึกษารายละเอียดได้ที่{' '}
              <Link href="/privacy" passHref>
                <MuiLink sx={{ textDecoration: 'underline' }}>นโยบายความเป็นส่วนตัว</MuiLink>
              </Link>{' '}
              และสามารถจัดการความเป็นส่วนตัวเองได้ของคุณได้เองโดยคลิกที่ตั้งค่า
            </Typography>
            <Stack direction="row" gap={2}>
              {/**TODO: There is only one setting `analytics_storage` if we have more consent mode, we would uncomment the code below */}
              {/* <Button onClick={handleOpenSettings} variant="outlined" fullWidth>
                ตั้งค่า
              </Button> */}
              <Button onClick={handleConsentAll} variant="contained" fullWidth>
                ยืนยัน
              </Button>
            </Stack>
          </Container>
        </FixedContainer>
      )}
      {/* <CookieSettings
        open={openSettings}
        onClose={handleCloseSettings}
        consents={consents}
        setConsents={setConsentsSetting}
        submitConsents={submitConsents}
      /> */}
    </>
  )
}
