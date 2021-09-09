import { Typography, DialogTitle, DialogContent, DialogActions, Stack } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'

import { Spacer } from '@/modules/Schedule/components/ScheduleTable/components/ScheduleTableCard/styled'
import { CourseCartItem, courseCartStore } from '@/store'

import { ActionButton } from './components/ActionButton'
import { CourseList } from './components/CourseList'
import { EmptyList } from './components/EmptyList'
import { useShoppingPanel } from './hooks/useShoppingPanel'

export interface CoursePropsType {
  data: Course[]
}

export const ShoppingPanel = () => {
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
      <DialogTitle sx={{ pt: [2, 4], pb: [1, 2] }}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">{t('selectedCourse')}</Typography>
          <Spacer />
          <Typography variant="h6">{t('totalCredit', { totalCredit })}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ py: 1, height: 350 }}>
        {sortedCourses.length === 0 && <EmptyList />}
        <Stack spacing={3}>
          {hasGenEdCourse && (
            <div>
              {shouldDisplayCategory && (
                <Typography mb={1} variant="h6">
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
                <Typography mb={1} variant="h6">
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
      <DialogActions sx={{ px: 3, pt: [1, 2], pb: [2, 4] }}>
        <ActionButton
          status={shoppingState}
          selectedCoursesNumnber={selectedCourses.length}
          removeAllSelectedCourses={removeAllSelectedCourses}
        />
      </DialogActions>
    </>
  )
}
