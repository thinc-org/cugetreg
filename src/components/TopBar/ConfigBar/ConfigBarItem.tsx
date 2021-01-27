import { styled } from '@material-ui/core'

export const ConfigBarItem = styled('span')(({ theme }) => ({
  ...theme.typography.subtitle2,
  marginLeft: 28,
  color: theme.palette.primaryRange[10],

  // Extend hit target
  padding: theme.spacing(1),
  marginRight: theme.spacing(-1),
}))
