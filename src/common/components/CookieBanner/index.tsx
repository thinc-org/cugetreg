import { Button, Link as MuiLink, Stack, Typography } from '@mui/material'
import { getCookie } from 'cookies-next'
import Link from 'next/link'

import { useCallback, useState } from 'react'

import { ConsentMode } from '@/common/constants/consents'
import { CookieKey } from '@/common/constants/cookie'
import { Tracker } from '@/common/tracker'

import { Consents } from '../../types/consents'
import { CookieSettings } from './components/CookieSettings'
import { Container, FixedContainer } from './styled'

export const CookieBanner = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [consents, setConsents] = useState<Consents>()
  const [show, setShow] = useState<boolean>(() => {
    const consents = JSON.parse((getCookie(CookieKey.CONSENTS) as string) ?? '{}') as Consents
    return 'checked' in consents ? !consents.checked : true
  })

  const setConsentsSetting = useCallback((newConsents: Consents) => {
    setConsents((oldConsents) => {
      const selectedConsents = { ...oldConsents, ...newConsents }
      Tracker.consents(selectedConsents)
      return selectedConsents
    })
  }, [])

  const handleConsentAll = () => {
    const selectedConsents: Consents = {
      [ConsentMode.AD_STORAGE]: true,
      [ConsentMode.ANALYTICS_STORAGE]: true,
      checked: true,
    }
    setConsentsSetting(selectedConsents)
    Tracker.consents(selectedConsents)
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  if (!show) return null

  return (
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
          <Button onClick={handleOpenSettings} variant="outlined" fullWidth>
            ตั้งค่า
          </Button>
          <Button onClick={handleConsentAll} variant="contained" fullWidth>
            ยืนยัน
          </Button>
        </Stack>
      </Container>
      <CookieSettings
        open={showSettings}
        onClose={() => {
          setShowSettings(false)
          setShow(false)
        }}
        consents={consents}
        setConsents={setConsentsSetting}
      />
    </FixedContainer>
  )
}
