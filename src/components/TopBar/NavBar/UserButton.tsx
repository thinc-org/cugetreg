import { getRedirectUrl } from '@/utils/network/auth'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import { MdCloudDone, MdCloudQueue, MdCloudOff } from 'react-icons/md'
import { observer } from 'mobx-react'
import { gDriveStore, GDriveSyncState } from '@/store/gDriveState'
import { authStore } from '@/store/meStore'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { NavBarItem } from '@/components/TopBar/NavBar/NavBarItem'

export const GDriveIndicator = observer(({ gdriveStore }: { gdriveStore: { gDriveState: GDriveSyncState } }) => {
  const mpr = new Map([
    [GDriveSyncState.IDLE, <></>],
    [
      GDriveSyncState.FAIL,
      <>
        <MdCloudOff /> Can&apos;t connect to Google Drive. Data won&apos;t be saved
      </>,
    ],
    [
      GDriveSyncState.SYNCING,
      <>
        <MdCloudQueue />
      </>,
    ],
    [
      GDriveSyncState.SYNCED,
      <>
        <MdCloudDone />
      </>,
    ],
    [
      GDriveSyncState.SYNCERR,
      <>
        <MdCloudOff /> Sync failed. Data won&apos;t be saved
      </>,
    ],
  ])
  return <>{mpr.get(gdriveStore.gDriveState)}</>
})

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
  const router = useRouter()

  const onLogin = useCallback(() => {
    const uri = getRedirectUrl()
    router.push(uri)
  }, [])
  const onLogout = useCallback(() => authStore.clear(), [])

  const { t } = useTranslation('navBar')

  if (pending) return null

  if (userName)
    return (
      <NavBarItemDiv>
        <SyncContainer>
          <GDriveIndicator gdriveStore={gDriveStore} />
          <UserContainer>
            <Typography variant="h6">{userName}</Typography>
          </UserContainer>
        </SyncContainer>
        <NavBarItem color="primary" onClick={onLogout}>
          {t('signout')}
        </NavBarItem>
      </NavBarItemDiv>
    )
  else return <NavBarItem onClick={onLogin}>{t('signin')}</NavBarItem>
})
