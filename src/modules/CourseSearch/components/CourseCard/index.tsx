import { Paper } from '@material-ui/core'
import { forwardRef, memo } from 'react'

import { CardAction } from '@/modules/CourseSearch/components/CourseCard/components/CardAction'
import { CardBody } from '@/modules/CourseSearch/components/CourseCard/components/CardBody'
import { CardHead } from '@/modules/CourseSearch/components/CourseCard/components/CardHead'
import { CourseCardContext } from '@/modules/CourseSearch/components/CourseCard/context'
import { useCourseCardContext } from '@/modules/CourseSearch/components/CourseCard/hooks/useCourseCard'
import { CourseCardProps } from '@/modules/CourseSearch/components/CourseCard/types'

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
