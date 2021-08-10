import { Typography, makeStyles, DialogTitle, DialogContent, DialogActions, Stack } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'

import { ActionButton } from '@/components/ShoppingPanel/components/ActionButton'
import { useShoppingPanel } from '@/components/ShoppingPanel/hooks'
import { CourseCartItem, courseCartStore } from '@/store'

import CourseList from './components/CourseList'
import { EmptyList } from './components/EmptyList'

export interface CoursePropsType {
  data: Course[]
}

const useStyles = makeStyles((theme) => ({
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    padding: theme.spacing(4, 3, 2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2, 1.5, 1),
    },
  },
  body: {
    height: 350,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.5),
    },
  },
  actions: {
    padding: theme.spacing(2, 3, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1, 1.5, 2),
    },
  },
  category: {
    marginBottom: theme.spacing(1),
  },
}))

const ShoppingPanel = () => {
  const classes = useStyles()
  const { shopItems } = courseCartStore
  const { shoppingState, selectedCourses, removeAllSelectedCourses, onCheckboxChange } = useShoppingPanel()

  const { t } = useTranslation('shoppingPanel')

  const totalCredit = shopItems.reduce((prev, { credit }) => prev + credit, 0)

  const sortedCourses = shopItems.sort((courseA: CourseCartItem, courseB: CourseCartItem) =>
    courseA.courseNo.localeCompare(courseB.courseNo)
  )
  const nonGenEdCourses = sortedCourses.filter((course) => course.genEdType === 'NO')
  const genEdCourses = sortedCourses.filter((course) => course.genEdType !== 'NO')
  const hasNonGenEdCourse = nonGenEdCourses.length > 0
  const hasGenEdCourse = genEdCourses.length > 0
  const shouldDisplayCategory = hasNonGenEdCourse && hasGenEdCourse

  return (
    <>
      <DialogTitle className={classes.title}>
        <div className={classes.titleWrapper}>
          <Typography variant="h4">{t('selectedCourse')}</Typography>
          <Typography variant="h6">{t('totalCredit', { totalCredit })}</Typography>
        </div>
      </DialogTitle>
      <DialogContent className={classes.body}>
        {sortedCourses.length === 0 && <EmptyList />}
        <Stack spacing={3}>
          {hasGenEdCourse && (
            <div>
              {shouldDisplayCategory && (
                <Typography className={classes.category} variant="h6">
                  {t('genedCourse')}
                </Typography>
              )}
              {genEdCourses.map((course) => (
                <CourseList key={course.courseNo} course={course} onChange={onCheckboxChange} />
              ))}
            </div>
          )}
          {hasNonGenEdCourse && (
            <div>
              {shouldDisplayCategory && (
                <Typography className={classes.category} variant="h6">
                  {t('otherCourse')}
                </Typography>
              )}
              {nonGenEdCourses.map((course) => (
                <CourseList key={course.courseNo} course={course} onChange={onCheckboxChange} />
              ))}
            </div>
          )}
        </Stack>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <ActionButton
          status={shoppingState}
          selectedCoursesNumnber={selectedCourses.length}
          removeAllSelectedCourses={removeAllSelectedCourses}
        />
      </DialogActions>
    </>
  )
}

export default ShoppingPanel
