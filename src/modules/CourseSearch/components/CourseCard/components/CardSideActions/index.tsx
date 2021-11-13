import { Collapse, Stack } from '@mui/material'

import { SelectButton } from '@/common/components/SelectButton'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { SUBJECT_SELECT_BUTTON } from '@/common/context/Analytics/constants'
import { SectionSelect } from '@/modules/CourseSearch/components/CourseCard/components/SectionSelect'
import { useCourseCard } from '@/modules/CourseSearch/components/CourseCard/context'

export function CardSideActions() {
  const { course, selectedSectionNumber, isExpanded } = useCourseCard()
  return (
    <Stack display={['none', 'flex']} flexBasis="auto" justifyContent="space-between" alignItems="stretch" ml={2}>
      <Collapse in={isExpanded}>
        <SectionSelect />
      </Collapse>
      <Analytics elementName={SUBJECT_SELECT_BUTTON} elementId={course.courseNo}>
        {({ log }) => (
          <SelectButton
            course={course}
            selectedSectionNumber={selectedSectionNumber}
            log={() => log(null, selectedSectionNumber)}
          />
        )}
      </Analytics>
    </Stack>
  )
}
