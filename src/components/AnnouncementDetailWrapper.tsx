import { makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles({
  wrapper: {
    maxWidth: 1000,
    margin: 'auto',
    marginTop: 90,
    marginBottom: 90,
  },
  gened: {
    padding: '24px 0',
  },
  update: {
    marginBottom: 10,
  },
})

interface PropsType {
  children: JSX.Element
  data: {
    title: string
    update: string
  }
}
const AnnouncementDetailWrapper = ({ children, data: { title, update } }: PropsType) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Typography variant="h2">{title}</Typography>
      <div className={classes.gened}>Some genedclip here</div>
      <Typography variant="h6" className={classes.update}>
        {update}
      </Typography>
      <article>{children}</article>
    </div>
  )
}

export default AnnouncementDetailWrapper
