import { Button, ButtonProps } from '@lib/react-ui'
import { Typography, styled } from '@mui/material'

const Item = styled(Button)`
  color: ${({ theme }) => theme.palette.primary.main};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin: ${({ theme }) => theme.spacing(0, -1, 0, 2)};
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  }
`
// TODO: will create a utility function for styling font from the theme
export const NavBarItem: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <Item {...props}>
      <Typography variant="h6">{children}</Typography>
    </Item>
  )
}
