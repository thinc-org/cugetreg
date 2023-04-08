import { Dispatch, SetStateAction } from 'react'
import { toast } from 'react-hot-toast'

import { ApolloQueryResult } from '@apollo/client'
import { Typography } from '@mui/material'

import LogoutButton from '@admin-web/common/LogoutButton'

import { Exact, GetOverridesQuery } from '@cgr/codegen'

import { LeftContainer, RightContainer, StyledButton, TopbarContainer } from './styled'

interface TopbarProps {
  setOpenAddGenEdDialog: Dispatch<SetStateAction<boolean>>
  refetchOverrides: (
    variables?:
      | Partial<
          Exact<{
            [key: string]: never
          }>
        >
      | undefined
  ) => Promise<ApolloQueryResult<GetOverridesQuery>>
}

export default function Topbar({ setOpenAddGenEdDialog, refetchOverrides }: TopbarProps) {
  const handleClick = () => {
    setOpenAddGenEdDialog(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <TopbarContainer>
      <LeftContainer>
        <Typography sx={{ fontWeight: 700, fontSize: 36 }}>Gen-ed</Typography>
      </LeftContainer>
      <RightContainer>
        <StyledButton variant="contained" onClick={() => refetchOverrides()}>
          Refresh
        </StyledButton>
        <StyledButton variant="contained" onClick={handleClick}>
          + Add
        </StyledButton>
        <LogoutButton />
      </RightContainer>
    </TopbarContainer>
  )
}
