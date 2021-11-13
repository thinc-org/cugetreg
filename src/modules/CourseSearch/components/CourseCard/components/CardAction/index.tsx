import { CardActions } from '@mui/material'

import { SelectButton } from '@/common/components/SelectButton'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { SUBJECT_SELECT_BUTTON } from '@/common/context/Analytics/constants'
import { useCourseCard } from '@/modules/CourseSearch/components/CourseCard/context'

export const CardAction = () => {
  const { course, selectedSectionNumber } = useCourseCard()
  return (
    <CardActions sx={{ p: 4, pt: 0, display: { sm: 'none' } }}>
      <Analytics elementName={SUBJECT_SELECT_BUTTON} elementId={course.courseNo}>
        {({ log }) => <SelectButton log={log} course={course} selectedSectionNumber={selectedSectionNumber} />}
      </Analytics>
    </CardActions>
  )
}
