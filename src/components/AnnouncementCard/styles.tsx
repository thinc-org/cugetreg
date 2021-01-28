import { Box } from '@material-ui/core'
import { makeStyles, styled } from '@material-ui/core/styles'

export const Image = styled('img')({
  margin: '0 25px 0 0',
  borderRadius: '4px',
  objectFit: 'cover',
})

export const BoxContainer = styled(Box)({
  padding: '25px 96px 25px 46px',
})

export const useStyles = makeStyles((theme) => ({
  date: {
    color: theme.palette.primaryRange['100'],
  },
}))
