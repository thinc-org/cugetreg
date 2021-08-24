import { Checkbox, Grid, Hidden, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import GenEdChip from '@/common/components/Chips/catagories/GenEdChip'
import { CourseName } from '@/modules/CourseSearch/components/ShoppingCartModal/components/ShoppingPanel/components/CourseName'

export interface CourseListPropsType {
  course: Course
  onChange: (checked: boolean, course: Course) => void
}

const CourseList = ({ course, onChange }: CourseListPropsType) => {
  const { courseNo, credit, genEdType } = course

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
    <Grid container alignItems="center">
      <Grid item xs="auto">
        <Checkbox sx={{ ml: -1 }} size="small" checked={checked} onChange={handleChange} />
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography variant="body1">{courseNo}</Typography>
      </Grid>
      <Grid item xs>
        <CourseName course={course} />
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
