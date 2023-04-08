import { Dispatch, SetStateAction } from 'react'

import { Typography } from '@mui/material'

import LogoutButton from '@admin-web/common/LogoutButton'

import { LeftContainer, RightContainer, StyledButton, TopbarContainer } from './styled'

interface TopbarProps {
  setOpenAddGenEdDialog: Dispatch<SetStateAction<boolean>>
}

export default function Topbar({ setOpenAddGenEdDialog }: TopbarProps) {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    setOpenAddGenEdDialog(true)
  }

  return (
    <TopbarContainer>
      <LeftContainer>
        <Typography sx={{ fontWeight: 700, fontSize: 36 }}>Gen-ed</Typography>
      </LeftContainer>
      <RightContainer>
        <StyledButton variant="contained" onClick={handleClick}>
          + Add
        </StyledButton>
        <LogoutButton />
      </RightContainer>
    </TopbarContainer>
  )
}
