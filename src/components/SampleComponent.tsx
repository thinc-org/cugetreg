import { Button, makeStyles, Typography } from '@material-ui/core'
import { useSampleHook } from '@/hooks/useSampleHook'
import { TextField } from '@material-ui/core'
import Link from 'next/link'

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
      <Typography>wwwww</Typography>
      <Link href="/course/2110211">
        <a>Course Detail: 2110211</a>
      </Link>
      <TextField label="sample" />
    </div>
  )
}
