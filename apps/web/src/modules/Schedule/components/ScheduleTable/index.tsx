import { Suspense, lazy, useEffect, useState } from 'react'

import { useCourseGroup } from '@web/common/hooks/useCourseGroup'
import { CourseCart } from '@web/store'

import { CourseOverlapMap } from '../Schedule/utils'
import { ScheduleTableCard } from './components/ScheduleTableCard'
import { CardLayout } from './components/ScheduleTableCard/styled'
import { Layout } from './styled'

export interface ScheduleTableProps {
  courseCart: CourseCart
  overlappingCourses: CourseOverlapMap
}

const InteractiveScheduleTable = lazy(() => import('./InteractiveScheduleTable'))

export function ScheduleTable({ courseCart, overlappingCourses }: ScheduleTableProps) {
  const [shouldRender, setShouldRender] = useState(false)
  useEffect(() => setShouldRender(true), [])
  if (!shouldRender) return null

  return (
    <Suspense
      fallback={
        <BasicScheduleTable courseCart={courseCart} overlappingCourses={overlappingCourses} />
      }
    >
      <InteractiveScheduleTable courseCart={courseCart} overlappingCourses={overlappingCourses} />
    </Suspense>
  )
}

export function BasicScheduleTable({ courseCart, overlappingCourses }: ScheduleTableProps) {
  const courseGroup = useCourseGroup()
  const items = courseCart.shopItemsByCourseGroup(courseGroup)

  return (
    <Layout>
      {items.map((item) => (
        <CardLayout key={item.courseNo}>
          <ScheduleTableCard item={item} overlaps={overlappingCourses[item.courseNo]} />
        </CardLayout>
      ))}
    </Layout>
  )
}
