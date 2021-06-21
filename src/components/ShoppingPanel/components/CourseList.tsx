import { Checkbox, Grid, makeStyles, Typography } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'
import GenEdChip from '@/components/Chips/catagories/GenEdChip'
import { useState } from 'react'

export interface CourseListPropsType {
  course: Course
  onChange: (checked: boolean, course: Course) => void
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
  checkbox: {
    marginRight: theme.spacing(0.5),
  },
}))

const CourseList = ({ course, onChange }: CourseListPropsType) => {
  const classes = useStyles()
  const { courseNo, abbrName, credit, genEdType } = course

  const [checked, setChecked] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setChecked((checked) => !checked)
    onChange(checked, course)
  }

  const { t } = useTranslation('shoppingPanel')

  return (
    <div className={classes.wrapper}>
      <Grid className={classes.rootGrid} container>
        <Grid item xs={2} sm={1}>
          <Checkbox checked={checked} onChange={handleChange} />
        </Grid>
        <Grid item xs={5} sm={3}>
          <Typography variant="body1">{courseNo}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1">{abbrName}</Typography>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Typography variant="body1">{t('credit', { credit: credit })}</Typography>
        </Grid>
        <Grid item={true} container xs={6} sm={2}>
          {genEdType !== 'NO' && <GenEdChip type={genEdType} />}
        </Grid>
      </Grid>
    </div>
  )
}

export default CourseList
