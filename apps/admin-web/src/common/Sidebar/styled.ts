import { AppBar, List, ListItem, styled } from '@mui/material'

export const StyledAppBar = styled(AppBar)({
  backgroundColor: 'black',
  padding: '15px 10px',
})

export const StyledListItem = styled(ListItem)({
  display: 'flex',
  flexDirection: 'column',
})

export const StyledList = styled(List)({})

export const StyledNav = styled('nav')({
  backgroundColor: '#F3F4F6',
  height: '100vh',
  borderRight: '1px solid #E5E7EB',
  position: 'sticky',
  top: 0,
})

export const StyledLogoContainer = styled('div')({
  padding: '24px 0 24px 24px',
})
