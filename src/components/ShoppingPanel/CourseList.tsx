import { Grid, makeStyles, Typography } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses-types'
import GenedChip from '@/components/GenEdChip'
import { GenEd } from '@/utils/types'
import { useTranslation } from 'react-i18next'
import { Delete } from '@material-ui/icons'

interface PropsType {
  course: Course
  deleteCourse: (id: string) => void
}

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(0.75, 0),
  },
  rootGrid: {
    alignItems: 'center',
  },
  deleteButton: {
    cursor: 'pointer',
    color: theme.palette.primaryRange[100],
  },
  deleteButtonWrapper: {
    display: 'flex',
    justifyContent: 'start',
    alighItems: 'center',
  },
}))

const CourseList = ({ course: { courseNo, abbrName, credit, genEdType }, deleteCourse }: PropsType) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <div className={classes.wrapper}>
      <Grid className={classes.rootGrid} container>
        <Grid item xs={1} sm={1}>
          <div className={classes.deleteButtonWrapper}>
            <Delete onClick={() => deleteCourse(courseNo)} className={classes.deleteButton} />
          </div>
        </Grid>
        <Grid item xs={5} sm={2}>
          <Typography variant="body1">{courseNo}</Typography>
        </Grid>
        <Grid item xs={6} sm={5}>
          <Typography variant="body1">{abbrName}</Typography>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Typography variant="body1">{credit + ` ${t('shoppingPanel:credit')}`}</Typography>
        </Grid>
        <Grid item={true} container xs={6} sm={2}>
          {genEdType !== null ? <GenedChip category={GenEd.HU} /> : ''}
        </Grid>
      </Grid>
    </div>
  )
}

export default CourseList
