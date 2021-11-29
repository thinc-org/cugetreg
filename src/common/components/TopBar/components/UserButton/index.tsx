import { useQuery } from '@apollo/client'
import { Typography } from '@mui/material'
import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { LOGIN_BUTTON, LOGOUT_BUTTON } from '@/common/context/Analytics/constants'
import { ME, MeResponse } from '@/services/apollo/query/user'
import { userStore } from '@/store/userStore'

import { GDriveIndicator } from '../GDriveIndicator'
import { NavBarItem } from '../NavBarItem'
import { NavBarItemDiv, UserContainer, SyncContainer } from './styled'

export const UserButton = observer(function UserButton() {
  const isLoggedIn = userStore.accessToken !== null

  const { t } = useTranslation('navBar')
  const router = useRouter()
  const onLogin = useCallback(() => userStore.login(router), [router])
  const { data } = useQuery<MeResponse>(ME, { skip: !isLoggedIn })

  if (isLoggedIn) {
    return (
      <NavBarItemDiv>
        <SyncContainer direction="row" alignItems="center">
          <GDriveIndicator />
          <UserContainer>
            <Typography variant="h6">{data?.me.name}</Typography>
          </UserContainer>
        </SyncContainer>
        <Analytics elementName={LOGOUT_BUTTON}>
          <NavBarItem color="primary" onClick={userStore.logout}>
            {t('signout')}
          </NavBarItem>
        </Analytics>
      </NavBarItemDiv>
    )
  } else {
    return (
      <Analytics elementName={LOGIN_BUTTON}>
        <NavBarItem onClick={onLogin}>{t('signin')}</NavBarItem>
      </Analytics>
    )
  }
})
