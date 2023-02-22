import { PropsWithChildren } from 'react'
import { Draggable } from 'react-beautiful-dnd'

import { CourseOverlap } from '@web/modules/Schedule/components/Schedule/utils'
import { CourseCartItem } from '@web/store'
import { observer } from 'mobx-react'

import { CardLayout } from './styled'

export type InteractiveCardLayoutProps = PropsWithChildren<{
  courseNo: string
  index: number
}>

export interface CardComponentProps {
  item: CourseCartItem
}

export interface CardDetailProps extends CardComponentProps {
  overlaps?: CourseOverlap
}

/* fixed axis drag hack */
function getStyle(style: React.CSSProperties | undefined) {
  if (style?.transform) {
    const axisLockY = `translate(0px, ${style.transform.split(',').pop()}`
    return { ...style, transform: axisLockY }
  }
  return style
}

export const InteractiveCardLayout = observer(
  ({ courseNo, index, children }: InteractiveCardLayoutProps) => {
    return (
      <Draggable draggableId={courseNo} index={index}>
        {(provided) => (
          <CardLayout
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getStyle(provided.draggableProps.style)}
          >
            {children}
          </CardLayout>
        )}
      </Draggable>
    )
  }
)
