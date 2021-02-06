import { makeStyles, Typography } from '@material-ui/core'
import { ReactNode } from 'react'

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
    marginBottom: 24,
  },
})

interface PropsType {
  children: ReactNode
  data: {
    title: string
    updatedTime: string
  }
}
const AnnouncementDetailWrapper = ({ children, data: { title, updatedTime } }: PropsType) => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Typography variant="h2">{title}</Typography>
      <div className={classes.gened}>Some genedclip here</div>
      <Typography variant="h6" className={classes.update}>
        {updatedTime}
      </Typography>
      <article>{children}</article>
    </div>
  )
}

export default AnnouncementDetailWrapper
