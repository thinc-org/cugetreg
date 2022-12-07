import { useTranslation } from 'react-i18next'

import { Typography } from '@mui/material'
import { observer } from 'mobx-react'

import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { LOGIN_BUTTON, LOGOUT_BUTTON } from '@web/common/context/Analytics/constants'
import { userStore } from '@web/store/userStore'

import { useMeQuery } from '@libs/codegen'

import { GDriveIndicator } from '../GDriveIndicator'
import { NavBarItem } from '../NavBarItem'
import { NavBarItemDiv, SyncContainer, UserContainer } from './styled'

export const UserButton = observer(function UserButton() {
  const isLoggedIn = userStore.accessToken !== null

  const { t } = useTranslation('navBar')
  const { data } = useMeQuery({ skip: !isLoggedIn })

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
        <NavBarItem onClick={userStore.login}>{t('signin')}</NavBarItem>
      </Analytics>
    )
  }
})
