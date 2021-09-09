import { Paper } from '@material-ui/core'
import { forwardRef, memo } from 'react'

import { CardAction } from './components/CardAction'
import { CardBody } from './components/CardBody'
import { CardHead } from './components/CardHead'
import { CourseCardContext } from './context'
import { useCourseCardContext } from './hooks/useCourseCard'
import { CourseCardProps } from './types'

export const CourseCard = memo(
  forwardRef<HTMLDivElement, CourseCardProps>(function CourseCard(props, ref) {
    const courseCardContextValue = useCourseCardContext(props.course)
    return (
      <CourseCardContext.Provider value={courseCardContextValue}>
        <Paper ref={ref} variant="outlined" sx={{ width: '100%' }}>
          <CardHead />
          <CardBody />
          <CardAction />
        </Paper>
      </CourseCardContext.Provider>
    )
  })
)
