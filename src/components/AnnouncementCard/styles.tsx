import { styledWithTheme } from '@/utils/styledWithTheme'
import { Typography } from '@material-ui/core'
import { IMAGE_SIZE } from './const'

export const Image = styledWithTheme('img')((theme) => ({
  marginRight: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  objectFit: 'cover',
}))

export const AnnouncementContainer = styledWithTheme('div')((theme) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  height: IMAGE_SIZE,
  padding: theme.spacing(3, 12, 3, 6),
}))

export const TagContainer = styledWithTheme('div')((theme) => ({
  margin: theme.spacing(3, 0),
  display: 'flex',
}))

export const Tag = styledWithTheme('div')((theme) => ({
  marginRight: theme.spacing(2),
}))

export const DateTitle = styledWithTheme(Typography)((theme) => ({
  color: theme.palette.primaryRange['100'],
}))
