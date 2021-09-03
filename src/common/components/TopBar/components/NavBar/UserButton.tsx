import styled from '@emotion/styled'
import { Tooltip, Typography } from '@material-ui/core'
import { observer } from 'mobx-react'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { MdCloudDone, MdCloudQueue, MdCloudOff } from 'react-icons/md'

import { NavBarItem } from '@/common/components/TopBar/components/NavBar/NavBarItem'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { LOGIN_BUTTON, LOGOUT_BUTTON } from '@/common/context/Analytics/constants'
import { login, logout } from '@/services/googleAPI'
import { grantGdriveSync } from '@/services/googleDrive'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'
import { gapiStore } from '@/store/googleApiStore'

export const GDriveIndicator = observer(() => {
  const { t } = useTranslation('syncStatus')
  switch (gDriveStore.gDriveState) {
    case GDriveSyncState.IDLE:
      return <></>
    case GDriveSyncState.FAIL:
      return (
        <SyncStatus title={t('fail')}>
          <MdCloudOff />
        </SyncStatus>
      )
    case GDriveSyncState.SYNCING:
      return (
        <SyncStatus title={t('syncing')}>
          <MdCloudQueue />
        </SyncStatus>
      )
    case GDriveSyncState.SYNCED:
      return (
        <SyncStatus title={t('synced')}>
          <MdCloudDone />
        </SyncStatus>
      )
    case GDriveSyncState.SYNCERR:
      return (
        <SyncStatus title={t('syncerr')}>
          <MdCloudOff />
        </SyncStatus>
      )
    case GDriveSyncState.NOGRANT:
      return (
        <SyncStatus title={t('nogrant')}>
          <MdCloudOff onClick={() => grantGdriveSync()} />
        </SyncStatus>
      )
  }
})

function SyncStatus({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <Tooltip title={title}>
      <span style={{ display: 'flex', alignItems: 'center' }}>{children}</span>
    </Tooltip>
  )
}

const NavBarItemDiv = styled.div`
  color: ${({ theme }) => theme.palette.primary.main};

  font-size: 20px;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    display: flex;
    align-items: center;
  }
`

const SyncContainer = styled.div`
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 8px;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: 8px;
  }
`

const UserContainer = styled.div`
  margin-left: 8px;
`

export const UserButton = observer(function UserButton() {
  const loaded = gapiStore.isLoaded
  const user = gapiStore.currentUser
  const isSignedIn = gapiStore.currentUser?.isSignedIn()

  const { t } = useTranslation('navBar')

  if (!loaded) return null

  const onLogin = () => login()

  if (user && isSignedIn) {
    return (
      <NavBarItemDiv>
        <SyncContainer>
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
