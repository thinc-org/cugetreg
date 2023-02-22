import { useTranslation } from 'react-i18next'

import { DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useCourseGroup } from '@web/common/hooks/useCourseGroup'
import { Spacer } from '@web/components/Spacer'
import { CourseCartItem, courseCartStore } from '@web/store'

import { Course } from '@cgr/codegen'

import { ActionButton } from './components/ActionButton'
import { CourseList } from './components/CourseList'
import { EmptyList } from './components/EmptyList'
import { useShoppingPanel } from './hooks/useShoppingPanel'

export interface CoursePropsType {
  data: Course[]
}

export const ShoppingPanel = () => {
  const courseGroup = useCourseGroup()
  const shopItems = courseCartStore.shopItemsByCourseGroup(courseGroup)
  const { shoppingState, selectedCourses, removeAllSelectedCourses, onCheckboxChange } =
    useShoppingPanel()

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
