import { Box, Card, CircularProgress, Grid, TextField, Typography } from '@material-ui/core'
import { CourseGroup, SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { StudyProgram } from '@thinc-org/chula-courses'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import ErrorIcon from '@material-ui/icons/Error'
import { useRouter } from 'next/router'
import { CourseCard } from '@/components/CourseCard'

interface Query {
  studyProgram: string
  academicYear: string
  semester: string
}

export function parseCourseGroupFromQuery(q: Query): CourseGroup {
  return {
    studyProgram: q.studyProgram as StudyProgram,
    academicYear: q.academicYear,
    semester: q.semester,
  }
}

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { data, loading, error } = useQuery<SearchCourseResponse, SearchCourseVars>(SEARCH_COURSE, {
    variables: {
      courseGroup: parseCourseGroupFromQuery(router.query),
      filter: {
        keyword: searchQuery,
      },
    },
  })

  return (
    <Box padding="2em">
      <Typography variant="h1">ค้นหาวิชาเรียน</Typography>
      <Grid>
        <TextField
          variant="outlined"
          placeholder="ค้นหารหัสวิชา/ชื่อวิชา"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Grid>
      <Grid padding="2%">
        {(() => {
          if (loading) return <CircularProgress />
          if (error)
            return (
              <>
                <ErrorIcon /> {error.message}
              </>
            )
          if (!data)
            //Weird
            return null

          return data?.search.map((r) => (
            <Card
              key={r.courseNo}
              onClick={() =>
                router.push(
                  `/${r.studyProgram}/courses/${r.courseNo}?academicYear=${r.academicYear}&semester=${r.semester}`
                )
              }
            >
              <CourseCard course={r} />
            </Card>
          ))
        })()}
      </Grid>
    </Box>
  )
}

export default SearchPage
