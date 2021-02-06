import { makeStyles, Typography } from '@material-ui/core'
import { ReactNode } from 'react'
import { GenEdChip } from '@/components/GenEdChip'
import { GenEdType } from '@thinc-org/chula-courses'
import { format } from 'date-fns'
import { enGB } from 'date-fns/locale'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxWidth: theme.breakpoints.values.md,
    margin: theme.spacing(11, 'auto'),
  },
  gened: {
    padding: theme.spacing(3, 0),
  },
  update: {
    marginBottom: theme.spacing(3),
  },
}))

interface PropsType {
  children: ReactNode
  data: {
    title: string
    updatedTime: Date | null
    gened: GenEdType
  }
}

const AnnouncementDetailWrapper = ({ children, data: { title, updatedTime, gened } }: PropsType) => {
  const classes = useStyles()
  const date = updatedTime ? format(updatedTime, 'dd/MM/yyyy hh:mm a', { locale: enGB }) : null
  return (
    <div className={classes.wrapper}>
      <Typography variant="h2">{title}</Typography>
      <div className={classes.gened}>
        <GenEdChip category={gened} />
      </div>
      <Typography variant="h6" className={classes.update}>
        {date}
      </Typography>
      <article>{children}</article>
    </div>
  )
}

export default AnnouncementDetailWrapper
