import { makeStyles } from '@material-ui/core/styles'

export const useCardStyles = makeStyles({
  root: {
    padding: '25px 96px 25px 46px',
    background: '#FFFFFF',
    borderRadius: '4px',
    display: 'flex',
  },
  tag: {
    margin: '24px 0',
  },
  image: {
    margin: '0 25px 0 0',
    borderRadius: '4px',
    width: '196px',
    height: '196px',
    background: 'cover center',
  },
})
