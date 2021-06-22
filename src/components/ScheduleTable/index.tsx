import { CourseCart } from '@/store'
import styled from '@emotion/styled'
import { useCallback } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { ScheduleTableCard } from './components/ScheduleTableCard'

export interface ScheduleTableProps {
  courseCart: CourseCart
}

const Layout = styled.div`
  padding-bottom: 100px;
`

export function ScheduleTable({ courseCart }: ScheduleTableProps) {
  const items = courseCart.shopItems

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return
      courseCart.reorder(result.source.index, result.destination.index)
    },
    [courseCart]
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="schedule">
        {(provided) => (
          <Layout {...provided.droppableProps} ref={provided.innerRef}>
            {items.map((item, index) => (
              <ScheduleTableCard key={item.courseNo} item={item} index={index} />
            ))}
            {provided.placeholder}
          </Layout>
        )}
      </Droppable>
    </DragDropContext>
  )
}
