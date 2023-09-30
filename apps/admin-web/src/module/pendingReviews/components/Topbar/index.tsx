import { Typography } from '@mui/material'

import LogoutButton from '@admin-web/common/LogoutButton'
import { useAuth } from '@admin-web/context/AuthProvider'

import { LeftContainer, RightContainer, TopbarContainer } from './styled'

export default function Topbar() {
  const { logout } = useAuth()

  return (
    <TopbarContainer>
      <LeftContainer>
        <Typography sx={{ fontWeight: 700, fontSize: 36 }}>Review Approval</Typography>
      </LeftContainer>
      <RightContainer>
        <LogoutButton handleClick={logout} />
      </RightContainer>
    </TopbarContainer>
  )
}
