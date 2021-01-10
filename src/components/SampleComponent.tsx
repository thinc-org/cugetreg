import { Button, makeStyles } from '@material-ui/core'
import { useSampleHook } from '../hooks/useSampleHook'

const useStyles = makeStyles((theme) => ({
  container: {
    width: 400,
    height: 200,
    background: theme.palette.background.paper,
  },
}))

export default function SampleComponent() {
  const classes = useStyles()
  const hello = useSampleHook()

  return (
    <div className={classes.container}>
      <Button variant="contained" color="primary">
        {hello}
      </Button>
    </div>
  )
}
