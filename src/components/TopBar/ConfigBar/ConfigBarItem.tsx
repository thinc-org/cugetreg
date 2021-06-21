import { styledWithTheme } from '@/utils/styledWithTheme'

export const ConfigBarItem = styledWithTheme('span')((theme) => ({
  ...theme.typography.subtitle2,
  marginLeft: 28,
  color: 'inherit',

  // Extend hit target
  padding: theme.spacing(1),
  marginRight: theme.spacing(-1),

  [theme.breakpoints.down('sm')]: {
    marginLeft: 20,
  },
}))
