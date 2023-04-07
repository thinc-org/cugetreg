import { Button, Select, Typography } from '@mui/material'

import LogoutButton from '@admin-web/common/LogoutButton'

import { LeftContainer, RightContainer, StyledButton, TopbarContainer } from './styled'

export default function Topbar() {
  return (
    <TopbarContainer>
      <LeftContainer>
        <Typography sx={{ fontWeight: 700, fontSize: 36 }}>Gen-ed</Typography>
      </LeftContainer>
      <RightContainer>
        <StyledButton variant="contained">+ Add</StyledButton>
        <LogoutButton />
      </RightContainer>
    </TopbarContainer>
  )
}
