import { Box } from '@material-ui/core'
import { makeStyles, styled } from '@material-ui/core/styles'

export const Image = styled('img')(({ theme }) => ({
  marginRight: theme.spacing(3),
  borderRadius: '4px',
  objectFit: 'cover',
}))

export const BoxContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 12, 3, 6),
}))

export const useStyles = makeStyles((theme) => ({
  date: {
    color: theme.palette.primaryRange['100'],
  },
}))
