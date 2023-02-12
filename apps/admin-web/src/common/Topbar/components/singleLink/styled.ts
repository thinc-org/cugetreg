import { Button, styled } from '@mui/material'

export const StyledButtonLink = styled(Button)({
  textDecoration: 'none',
  color: 'white',
  marginRight: '20px',
  '&:hover': {
    backgroundColor: 'white',
    color: 'black',
  },
})
