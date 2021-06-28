import { FormControl, MenuItem, Select, useMediaQuery, useTheme } from '@material-ui/core'
import { useCourseCardContext } from '../useCourseCard'
import { Analytics } from '@/context/analytics/components/Analytics'
import { SECTION_SELECT } from '@/context/analytics/components/const'

export function SectionSelect() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const { selectedSectionNumber, setSectionNumber, sectionNumbers, course } = useCourseCardContext()
  return (
    <FormControl fullWidth={isDesktop}>
      <Analytics elementName={SECTION_SELECT} elementId={course.courseNo}>
        {({ log }) => (
          <Select
            onClick={log}
            value={selectedSectionNumber}
            onChange={(e) => setSectionNumber(e.target.value as string)}
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
