import { Box, Stack, Typography } from '@material-ui/core'
import { CourseList } from '@/components/CourseList'
import { SearchField } from '@/components/SearchField'
import { FilterIconButton } from '@/components/FilterIconButton'
import { SelectedCoursesButton } from '@/components/SelectedCoursesButton'

function CourseSearchPage() {
  return (
    <Box padding="2em">
      <Typography variant="h1">ค้นหาวิชาเรียน</Typography>
      <Stack spacing={2} direction="row">
        <SearchField />
        <FilterIconButton />
        <SelectedCoursesButton />
      </Stack>
      <CourseList />
    </Box>
  )
}

export default CourseSearchPage
