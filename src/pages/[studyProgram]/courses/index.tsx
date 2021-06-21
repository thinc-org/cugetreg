import { useContext } from 'react'
import { Box, Stack as MuiStack, Typography } from '@material-ui/core'
import { CourseList } from '@/components/CourseList'
import { SearchField } from '@/components/SearchField'
import { FilterIconButton } from '@/components/FilterIconButton'
import { SelectedCoursesButton } from '@/components/SelectedCoursesButton'
import { CourseSearchContext } from '@/context/CourseSearch'
import { FilterBar } from '@/components/FilterBar'
import styled from '@emotion/styled'
import { CourseGroup } from '@/utils/network/BackendGQLQueries'
import { StudyProgram } from '@thinc-org/chula-courses'
import { ParsedUrlQuery } from 'querystring'

export function parseCourseGroupFromQuery(q: ParsedUrlQuery): CourseGroup {
  return {
    studyProgram: q.studyProgram as StudyProgram,
    academicYear: q.academicYear as string,
    semester: q.semester as string,
  }
}

const Stack = styled(MuiStack)`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

function CourseSearchPage() {
  const { openFilterBar } = useContext(CourseSearchContext)

  return (
    <Box padding="2em">
      <Stack spacing={2} direction="row">
        <Typography variant="h2">ค้นหาวิชาเรียน</Typography>
      </Stack>
      <Stack spacing={2} direction="row">
        <SearchField />
        <FilterIconButton />
        <SelectedCoursesButton />
      </Stack>
      <Stack spacing={3} direction="row">
        <CourseList />
        {openFilterBar && <FilterBar />}
      </Stack>
    </Box>
  )
}

export default CourseSearchPage
