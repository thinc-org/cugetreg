import { makeStyles, Typography } from '@material-ui/core'
import { ReactNode } from 'react'
import { GenEdChip } from '@/components/GenEdChip'
import { GenEdType } from '@thinc-org/chula-courses'

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
    gened: GenEdType
  }
}
const AnnouncementDetailWrapper = ({ children, data: { title, updatedTime, gened } }: PropsType) => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <Typography variant="h2">{title}</Typography>
      <div className={classes.gened}>
        <GenEdChip category={gened} />
      </div>
      <Typography variant="h6" className={classes.update}>
        {updatedTime}
      </Typography>
      <article>{children}</article>
    </div>
  )
}

export default AnnouncementDetailWrapper
