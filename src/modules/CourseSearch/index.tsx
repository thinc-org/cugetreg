import { Hidden, Typography } from '@material-ui/core'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { FILTER_BUTTON, SELECTED_COURSES_BUTTON, OPEN_SHOPPING_CART_BUTTON } from '@/common/context/Analytics/constants'
import { PageMeta } from '@/components/PageMeta'
import { CourseList } from '@/modules/CourseSearch/components/CourseList'
import { FilterIconButton } from '@/modules/CourseSearch/components/FilterIconButton'
import { FilterSection } from '@/modules/CourseSearch/components/FilterSection'
import { SearchField } from '@/modules/CourseSearch/components/SearchField'
import { SelectedCoursesButton } from '@/modules/CourseSearch/components/SelectedCoursesButton'
import { NoTagListLayout, TagList } from '@/modules/CourseSearch/components/TagList'

import { CourseSearchProvider } from './context/CourseSearch'
import { useCourseSearchPage } from './hooks/useCourseSearchPage'
import { Container, Stack, TitleStack, StickyStack } from './styled'

export function CourseSearchPage() {
  const { openFilterBar, toggleFilterBar, onOpen, handleCloseFilterBar } = useCourseSearchPage()

  return (
    <Container>
      <PageMeta title="ค้นหาวิชาเรียน" />
      <TitleStack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">ค้นหาวิชาเรียน</Typography>
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
