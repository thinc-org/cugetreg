import { CardActions, Paper } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import { useDisclosure } from '@/hooks/useDisclosure'
import { CourseCardContext, useCourseCard } from '@/components/CourseCard/useCourseCard'
import { SelectButton } from './components/SelectButton'
import { CardBody } from './components/CardBody'
import { CardHeading } from './components/CardHeading'
import { memo } from 'react'

export interface CourseCardProps {
  course: Course
  rating?: number
}

const CourseCard = (props: CourseCardProps) => {
  const { course } = props
  const { isOpen: isExpanded, onToggle } = useDisclosure()

  const courseCardContextValue = useCourseCard(course)

  return (
    <CourseCardContext.Provider value={courseCardContextValue}>
      <Paper variant="outlined" sx={{ width: '100%' }}>
        <CardHeading isExpanded={isExpanded} onToggle={onToggle} />
        <CardBody isExpanded={isExpanded} />
        <CardActions sx={{ p: 4, pt: 0, display: { sm: 'none' } }}>
          <SelectButton course={course} />
        </CardActions>
      </Paper>
    </CourseCardContext.Provider>
  )
}

const MemoCourseCard = memo(CourseCard)

export { MemoCourseCard as CourseCard }
