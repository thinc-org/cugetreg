import {
  Hidden,
  MenuItem,
  Stack as MuiStack,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'

import { termOptions } from '@web/common/constants/terms'
import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import {
  FILTER_BUTTON,
  OPEN_SHOPPING_CART_BUTTON,
  SELECTED_COURSES_BUTTON,
} from '@web/common/context/Analytics/constants'
import { useCourseGroup } from '@web/common/hooks/useCourseGroup'
import { PageMeta } from '@web/components/PageMeta'
import { CourseList } from '@web/modules/CourseSearch/components/CourseList'
import { FilterIconButton } from '@web/modules/CourseSearch/components/FilterIconButton'
import { FilterSection } from '@web/modules/CourseSearch/components/FilterSection'
import { WrappedRecommendationText } from '@web/modules/CourseSearch/components/RecommendationText'
import { SearchField } from '@web/modules/CourseSearch/components/SearchField'
import { SelectedCoursesButton } from '@web/modules/CourseSearch/components/SelectedCoursesButton'
import { TagList } from '@web/modules/CourseSearch/components/TagList'

import { CourseSearchProvider } from './context/CourseSearch'
import { useCourseSearchPage } from './hooks/useCourseSearchPage'
import { Container, Stack, StickyStack, TitleStack } from './styled'

export function CourseSearchPage() {
  const { openFilterBar, toggleFilterBar, onOpen, handleCloseFilterBar } = useCourseSearchPage()

  const { academicYear, semester, setTerm } = useCourseGroup()
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))

  const handleChange = (e: SelectChangeEvent<string>) => {
    const term = e.target.value as string
    setTerm(term)
  }

  return (
    <Container>
      <PageMeta title="ค้นหาวิชาเรียน" />
      <TitleStack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
        <MuiStack direction="row" spacing={2} alignItems="center">
          <Typography variant="h2">ค้นหาวิชาเรียน</Typography>
          {isSmUp && (
            <Select value={`${academicYear}/${semester}`} onChange={handleChange}>
              {termOptions.map(({ academicYear, semester, label }) => (
                <MenuItem key={`${academicYear}/${semester}`} value={`${academicYear}/${semester}`}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          )}
        </MuiStack>
        <Hidden mdUp>
          <Analytics elementName={OPEN_SHOPPING_CART_BUTTON}>
            <SelectedCoursesButton onClick={onOpen} />
          </Analytics>
        </Hidden>
      </TitleStack>
      <StickyStack alignItems="flex-start">
        <Stack width="100%" spacing={2} direction="row">
          <SearchField />
          <Analytics elementName={FILTER_BUTTON}>
            <FilterIconButton onClick={toggleFilterBar} />
          </Analytics>
          <Hidden mdDown>
            <Analytics elementName={SELECTED_COURSES_BUTTON}>
              <SelectedCoursesButton onClick={onOpen} />
            </Analytics>
          </Hidden>
        </Stack>
        <TagList />
      </StickyStack>
      <WrappedRecommendationText />
      <Stack spacing={3} direction="row">
        <CourseList />
        <FilterSection open={openFilterBar} handleClose={handleCloseFilterBar} />
      </Stack>
    </Container>
  )
}

export const CourseSearchPageWithCourseSearchProvider = () => {
  return (
    <CourseSearchProvider>
      <CourseSearchPage />
    </CourseSearchProvider>
  )
}
