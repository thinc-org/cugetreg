import { useCallback } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'

import { useCourseGroup } from '@web/common/hooks/useCourseGroup'
import { CourseCart } from '@web/store'
import { LazyMotion, domMax } from 'framer-motion'

import { CourseOverlapMap } from '../Schedule/utils'
import { ScheduleTableCard } from './components/ScheduleTableCard'
import { InteractiveCardLayout } from './components/ScheduleTableCard/InteractiveCardLayout'
import { Layout } from './styled'

export interface ScheduleTableProps {
  courseCart: CourseCart
  overlappingCourses: CourseOverlapMap
}

// eslint-disable-next-line import/no-default-export
export default function InteractiveScheduleTable({
  courseCart,
  overlappingCourses,
}: ScheduleTableProps) {
  const courseGroup = useCourseGroup()
  const items = courseCart.shopItemsByCourseGroup(courseGroup)

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return
      courseCart.reorder(courseGroup, result.source.index, result.destination.index)
    },
    [courseCart, courseGroup]
  )

  return (
    <LazyMotion features={domMax}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="schedule">
          {(provided) => (
            <Layout {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
                <InteractiveCardLayout key={item.courseNo} courseNo={item.courseNo} index={index}>
                  <ScheduleTableCard item={item} overlaps={overlappingCourses[item.courseNo]} />
                </InteractiveCardLayout>
              ))}
              {provided.placeholder}
            </Layout>
          )}
        </Droppable>
      </DragDropContext>
    </LazyMotion>
  )
}
