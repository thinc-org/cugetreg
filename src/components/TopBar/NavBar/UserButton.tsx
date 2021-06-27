import { getRedirectUrl } from '@/utils/network/auth'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import PersonIcon from '@material-ui/icons/Person'
import { Box, Button, CircularProgress, Grid, Typography } from '@material-ui/core'
import { ImWarning, ImGoogleDrive } from 'react-icons/im'
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
        <ImWarning size="2em" /> Can&apos;t connect to Google Drive. Data won&apos;t be saved
      </>,
    ],
    [
      GDriveSyncState.SYNCING,
      <>
        <CircularProgress />
      </>,
    ],
    [
      GDriveSyncState.SYNCED,
      <>
        <ImGoogleDrive size="2em" />
      </>,
    ],
    [
      GDriveSyncState.SYNCERR,
      <>
        <ImWarning size="2em" /> Sync failed. Data won&apos;t be saved
      </>,
    ],
  ])
  return <Box>{mpr.get(gdriveStore.gDriveState)}</Box>
})

const NavBarItemDiv = styled.div`
  color: ${({ theme }) => theme.palette.primary.main};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin: ${({ theme }) => theme.spacing(0, -1, 0, 2)};
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  }
`

const NavbarContainer = styled(Typography)`
  display: flex;
  align-items: center;
`

export default observer(function UserButton() {
  const userName = authStore.auth?.firstName
  const router = useRouter()

  const onLogin = useCallback(() => {
    const uri = getRedirectUrl()
    router.push(uri)
  }, [])
  const onLogout = useCallback(() => authStore.clear(), [])

  const { t } = useTranslation()

  if (userName)
    return (
      <NavBarItemDiv>
        <NavbarContainer variant="h6">
          <Grid margin="1em" container>
            <Grid item paddingLeft="1em">
              <GDriveIndicator gdriveStore={gDriveStore} />
            </Grid>
            <Grid display="flex" alignItems="center" padding="0.2em" item>
              <PersonIcon />
            </Grid>
            <Grid item>
              <Typography variant="h4">{userName}</Typography>
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={onLogout}>
            Logout
          </Button>
        </NavbarContainer>
      </NavBarItemDiv>
    )
  else return <NavBarItem onClick={onLogin}>{t('navBar:signin')}</NavBarItem>
})
