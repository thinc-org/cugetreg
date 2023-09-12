import { Button, styled } from '@mui/material'

export const StyledLogoutButton = styled(Button)({
  width: '120px',
  height: '40px',
  background: '#FFFFFF',
  border: '2px solid #D54C0C',
  color: '#D54C0C',
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '16px',
  lineHeight: '24px',
  borderRadius: '8px',
  textTransform: 'initial',
  '&:hover': {
    background: '#D54C0C',
    color: '#FFFFFF',
  },
})
