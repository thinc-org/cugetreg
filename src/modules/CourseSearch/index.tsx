import {
  Hidden,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack as MuiStack,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import dynamic from 'next/dynamic'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { FILTER_BUTTON, SELECTED_COURSES_BUTTON, OPEN_SHOPPING_CART_BUTTON } from '@/common/context/Analytics/constants'
import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { PageMeta } from '@/components/PageMeta'
import { CourseList } from '@/modules/CourseSearch/components/CourseList'
import { FilterIconButton } from '@/modules/CourseSearch/components/FilterIconButton'
import { FilterSection } from '@/modules/CourseSearch/components/FilterSection'
import { WrappedRecommendationText } from '@/modules/CourseSearch/components/RecommendationText'
import { SearchField } from '@/modules/CourseSearch/components/SearchField'
import { SelectedCoursesButton } from '@/modules/CourseSearch/components/SelectedCoursesButton'
import { NoTagListLayout, TagList } from '@/modules/CourseSearch/components/TagList'

import { CourseSearchProvider } from './context/CourseSearch'
import { useCourseSearchPage } from './hooks/useCourseSearchPage'
import { Container, Stack, TitleStack, StickyStack } from './styled'

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
            <Select defaultValue={`${academicYear}/${semester}`} onChange={handleChange}>
              <MenuItem value="2564/2">2564/2</MenuItem>
              <MenuItem value="2564/1">2564/1</MenuItem>
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
      <NoTagListLayout />
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
