import { CardActions, Paper } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import { useDisclosure } from '@/hooks/useDisclosure'
import { CourseCardContext, useCourseCard } from '@/components/CourseCard/useCourseCard'
import { SelectButton } from '@/components/SelectButton'
import { CardBody } from './components/CardBody'
import { CardHeading } from './components/CardHeading'
import { forwardRef, memo } from 'react'

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
              <SelectButton course={course} selectedSectionNumber={courseCardContextValue.selectedSectionNumber} />
            </CardActions>
          </Paper>
        </div>
      </CourseCardContext.Provider>
    )
  })
)
