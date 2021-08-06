import { CardActions, Paper } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import { forwardRef, memo } from 'react'

import { SelectButton } from '@/components/SelectButton'
import { useDisclosure } from '@/context/ShoppingCartModal/hooks'
import { Analytics } from '@/context/analytics/components/Analytics'
import { SUBJECT_SELECT_BUTTON } from '@/context/analytics/components/const'
import { CourseCardContext, useCourseCard } from '@/modules/CourseSearch/component/CourseCard/useCourseCard'

import { CardBody } from './components/CardBody'
import { CardHeading } from './components/CardHeading'

export interface CourseCardProps {
  course: Course
  rating?: number
}

export const CourseCard = memo(
  forwardRef<HTMLDivElement, CourseCardProps>(function CourseCard(props, ref) {
    const { course } = props
    const { isOpen: isExpanded, onToggle } = useDisclosure()

    const courseCardContextValue = useCourseCard(course)

    return (
      <CourseCardContext.Provider value={courseCardContextValue}>
        <div ref={ref}>
          <Paper variant="outlined" sx={{ width: '100%' }}>
            <CardHeading isExpanded={isExpanded} onToggle={onToggle} />
            <CardBody isExpanded={isExpanded} />
            <CardActions sx={{ p: 4, pt: 0, display: { sm: 'none' } }}>
              <Analytics elementName={SUBJECT_SELECT_BUTTON} elementId={course.courseNo}>
                {({ log }) => (
                  <SelectButton
                    log={log}
                    course={course}
                    selectedSectionNumber={courseCardContextValue.selectedSectionNumber}
                  />
                )}
              </Analytics>
            </CardActions>
          </Paper>
        </div>
      </CourseCardContext.Provider>
    )
  })
)
