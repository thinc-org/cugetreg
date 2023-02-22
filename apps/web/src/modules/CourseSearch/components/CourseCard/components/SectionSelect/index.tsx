import { FormControl, MenuItem, Select, useMediaQuery, useTheme } from '@mui/material'
import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { SECTION_SELECT } from '@web/common/context/Analytics/constants'
import { useCourseCard } from '@web/modules/CourseSearch/components/CourseCard/context'

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
