import { styled } from '@material-ui/core'

export const Container = styled('div')(({ theme }) => ({
  // TODO: add responsive size
  width: '100%',
  maxWidth: 1024,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  margin: '0 auto',
}))
