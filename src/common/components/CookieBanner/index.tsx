import { Button, Link as MuiLink, Stack, Typography } from '@mui/material'
import { getCookie, setCookies } from 'cookies-next'
import Link from 'next/link'

import { useCallback, useEffect, useState } from 'react'

import { CookieSettings } from './components/CookieSettings'
import { CookieKey } from './constants'
import { Container, FixedContainer } from './styled'
import { Consents } from './types'

export enum ConsentMode {
  AD_STORAGE = 'ad_storage',
  ANALYTICS_STORAGE = 'analytics_storage',
}

export const CookieBanner = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [consents, setConsents] = useState<Consents>()
  const [show, setShow] = useState<boolean>(() => {
    const consents = JSON.parse((getCookie(CookieKey.CONSENTS) as string) ?? '{}') as Consents
    return 'checked' in consents ? !consents.checked : false
  })

  const setConsentsSetting = useCallback((value: Consents) => {
    setConsents((consents) => {
      const data = { ...consents, ...value }
      setCookies(CookieKey.CONSENTS, JSON.stringify(data))
      return data
    })
  }, [])

  const handleConsentAll = () => {
    setConsentsSetting({
      [ConsentMode.AD_STORAGE]: true,
      [ConsentMode.ANALYTICS_STORAGE]: true,
      checked: true,
    })
    setShow(false)
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  useEffect(() => {
    const consents = JSON.parse((getCookie(CookieKey.CONSENTS) as string) ?? '{}') as Consents
    if (!consents?.checked) {
      setConsentsSetting({
        [ConsentMode.AD_STORAGE]: true,
        [ConsentMode.ANALYTICS_STORAGE]: true,
      })
    }
  }, [setConsentsSetting])

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
