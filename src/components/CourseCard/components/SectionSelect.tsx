import { FormControl, MenuItem, Select, useMediaQuery, useTheme } from '@material-ui/core'
import { useCourseCardContext } from '../useCourseCard'

export function SectionSelect() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const { selectedSectionNumber, setSectionNumber, sectionNumbers } = useCourseCardContext()
  return (
    <FormControl fullWidth={isDesktop}>
      <Select
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
    </FormControl>
  )
}
