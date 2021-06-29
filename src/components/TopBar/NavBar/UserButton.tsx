import { PropsWithChildren, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip, Typography } from '@material-ui/core'
import { MdCloudDone, MdCloudQueue, MdCloudOff } from 'react-icons/md'
import { observer } from 'mobx-react'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'
import { authStore } from '@/store/meStore'
import styled from '@emotion/styled'
import { NavBarItem } from '@/components/TopBar/NavBar/NavBarItem'
import env from '@/utils/env/macro'
import GoogleLogin from '@/lib/react-google-login/src'
import { Analytics } from '@/context/analytics/components/Analytics'
import { LOGIN_BUTTON, LOGOUT_BUTTON } from '@/context/analytics/components/const'

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

export default observer(function UserButton() {
  const pending = authStore.pending
  const userName = authStore.auth?.firstName

  const onLogout = useCallback(() => authStore.clear(), [])

  const { t } = useTranslation('navBar')

  if (pending) return null

  if (userName) {
    return (
      <NavBarItemDiv>
        <SyncContainer>
          <GDriveIndicator />
          <UserContainer>
            <Typography variant="h6">{userName}</Typography>
          </UserContainer>
        </SyncContainer>
        <Analytics elementName={LOGOUT_BUTTON}>
          {({ log }) => (
            <NavBarItem
              color="primary"
              onClick={() => {
                log()
                onLogout()
              }}
            >
              {t('signout')}
            </NavBarItem>
          )}
        </Analytics>
      </NavBarItemDiv>
    )
  } else {
    return (
      <GoogleLogin
        clientId={env.googleauth.clientid!}
        responseType="code"
        scope="openid profile email https://www.googleapis.com/auth/drive.appdata"
        accessType="offline"
        hostedDomain="student.chula.ac.th"
        prompt="consent"
        redirectUri={`${location.origin}/googleauthcallback`}
        render={(renderProps) => (
          <Analytics elementName={LOGIN_BUTTON}>
            {({ log }) => (
              <NavBarItem onClick={log} {...renderProps}>
                {t('signin')}
              </NavBarItem>
            )}
          </Analytics>
        )}
        onSuccess={({ code }: { code: string }) => {
          authStore.authenticateWithCode(code)
        }}
        onFailure={() => {
          // do nothing
        }}
      />
    )
  }
})
