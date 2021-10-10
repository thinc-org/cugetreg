import { FormControl, MenuItem, Select, useMediaQuery, useTheme } from '@material-ui/core'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { SECTION_SELECT } from '@/common/context/Analytics/constants'
import { useCourseCard } from '@/modules/CourseSearch/components/CourseCard/context'

export function SectionSelect() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const { selectedSectionNumber, setSectionNumber, sectionNumbers, course } = useCourseCard()
  return (
    <FormControl fullWidth={isDesktop}>
      <Analytics elementName={SECTION_SELECT} elementId={course.courseNo}>
        {({ log }) => (
          <Select
            value={selectedSectionNumber}
            onChange={(e) => {
              const sectionNumber = e.target.value as string
              log(null, sectionNumber)
              setSectionNumber(sectionNumber)
            }}
            name="sectionNo"
          >
            {sectionNumbers.map((value) => (
              <MenuItem key={value} value={value}>
                Sec {value}
              </MenuItem>
            ))}
          </Select>
        )}
      </Analytics>
    </FormControl>
  )
}
