import { getRedirectUrl, GetAuthData, GET_AUTH_DATA, logout } from '@/utils/network/auth'
import { useQuery } from '@apollo/client'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { NavBarItem } from './NavBarItem'
import PersonIcon from '@material-ui/icons/Person'

export default function UserButton() {
  const { data } = useQuery<GetAuthData>(GET_AUTH_DATA)
  const userName = data?.authData?.firstName
  const onLogin = useCallback(() => {
    const uri = getRedirectUrl()
    location.assign(uri)
  }, [])
  const onLogout = useCallback(logout, [])

  const { t } = useTranslation()

  if (userName)
    return (
      <NavBarItem onClick={onLogout}>
        <PersonIcon /> {userName}
      </NavBarItem>
    )
  else return <NavBarItem onClick={onLogin}>{t('navBar:signin')}</NavBarItem>
}
