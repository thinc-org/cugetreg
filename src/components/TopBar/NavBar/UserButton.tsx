import { authData, getRedirectUrl, logout, useMe } from '@/utils/network/auth'
import { useReactiveVar } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { NavBarItem } from './NavBarItem'
import PersonIcon from '@material-ui/icons/Person'
import { Box, Button } from '@material-ui/core'

export default function UserButton() {
  const data = useReactiveVar(authData)
  const userName = data?.firstName

  const onLogin = useCallback(() => {
    const uri = getRedirectUrl()
    location.assign(uri)
  }, [])
  const onLogout = useCallback(logout, [])

  const { t } = useTranslation()

  if (userName)
    return (
      <NavBarItem>
        <Box margin="1em">
          <PersonIcon /> {userName}
        </Box>
        <Button variant="contained" color="primary" onClick={onLogout}>
          Logout
        </Button>
      </NavBarItem>
    )
  else return <NavBarItem onClick={onLogin}>{t('navBar:signin')}</NavBarItem>
}
