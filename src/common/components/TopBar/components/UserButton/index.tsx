import { Typography } from '@material-ui/core'
import { observer } from 'mobx-react'
import { useTranslation } from 'react-i18next'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { LOGIN_BUTTON, LOGOUT_BUTTON } from '@/common/context/Analytics/constants'
import { login, logout } from '@/services/googleAPI'
import { gapiStore } from '@/store/googleApiStore'

import { GDriveIndicator } from '../GDriveIndicator'
import { NavBarItem } from '../NavBarItem'
import { NavBarItemDiv, UserContainer, SyncContainer } from './styled'

export const UserButton = observer(function UserButton() {
  const loaded = gapiStore.isLoaded
  const user = gapiStore.currentUser
  const isSignedIn = gapiStore.currentUser?.isSignedIn()

  const { t } = useTranslation('navBar')
  const onLogin = () => login()

  if (!loaded) return null

  if (user && isSignedIn) {
    return (
      <NavBarItemDiv>
        <SyncContainer direction="row" alignItems="center">
          <GDriveIndicator />
          <UserContainer>
            <Typography variant="h6">{user.getBasicProfile().getName()}</Typography>
          </UserContainer>
        </SyncContainer>
        <Analytics elementName={LOGOUT_BUTTON}>
          <NavBarItem color="primary" onClick={logout}>
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
