import { styled } from '@material-ui/core'

export const ConfigBarItem = styled('span')(({ theme }) => ({
  marginLeft: 28,
  fontSize: 12,
  color: theme.palette.primaryRange[10],

  // Extend hit target
  padding: 8,
  marginRight: -8,
}))
