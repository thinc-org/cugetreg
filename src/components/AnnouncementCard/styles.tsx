import { Box } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'

export const Image = styled('img')({
  margin: '0 25px 0 0',
  borderRadius: '4px',
  width: '196px',
  height: '196px',
  background: 'cover center',
})

export const BoxContainer = styled(Box)({
  padding: '25px 96px 25px 46px',
  background: '#FFFFFF',
  borderRadius: '4px',
})

export const Tag = styled('div')({
  margin: '24px 0',
})
