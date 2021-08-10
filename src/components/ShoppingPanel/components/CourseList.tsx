import { Checkbox, Grid, Hidden, makeStyles, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import GenEdChip from '@/components/Chips/catagories/GenEdChip'
import { CourseName } from '@/components/ShoppingPanel/components/CourseName'

export interface CourseListPropsType {
  course: Course
  onChange: (checked: boolean, course: Course) => void
}

const useStyles = makeStyles((theme) => ({
  rootGrid: {
    alignItems: 'center',
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

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Grid className={classes.rootGrid} container>
      <Grid item xs="auto">
        <Checkbox size="small" checked={checked} onChange={handleChange} />
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography variant="body1">{courseNo}</Typography>
      </Grid>
      <Grid item xs>
        <CourseName type={genEdType} courseName={abbrName} />
      </Grid>
      <Grid item xs={2} sm={3}>
        <Typography variant="body1">{matches ? t('credit', { credit }) : t('creditAbbr', { credit })}</Typography>
      </Grid>
      <Hidden smDown>
        <Grid item xs={2}>
          {genEdType !== 'NO' && <GenEdChip type={genEdType} />}
        </Grid>
      </Hidden>
    </Grid>
  )
}

export default CourseList
