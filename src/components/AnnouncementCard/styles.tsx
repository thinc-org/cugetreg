import { Typography } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import { IMAGE_SIZE } from './const'

export const Image = styled('img')(({ theme }) => ({
  marginRight: theme.spacing(3),
  borderRadius: '4px',
  objectFit: 'cover',
}))

export const AnnouncementContainer = styled('div')(({ theme }) => ({
  borderRadius: '4px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  height: IMAGE_SIZE,
  padding: theme.spacing(3, 12, 3, 6),
}))

export const TagContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(3, 0),
  display: 'flex',
}))

export const Tag = styled('div')(({ theme }) => ({
  marginRight: theme.spacing(2),
}))

export const DateTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primaryRange['100'],
}))
