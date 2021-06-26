import React from 'react'

import { Stack } from '@material-ui/core'
import { Loading } from '@/components/Loading'
import { Error } from '@/components/Error'
<<<<<<< refs/remotes/origin/dev
import { RenderOnIntersect } from '../RenderOnIntersect'
import { QueryResult } from '@apollo/client'
import { SearchCourseResponse, SearchCourseVars } from '@/utils/network/BackendGQLQueries'
=======
import { useCourseList } from '@/components/CourseList/hooks'
import { Courses } from '@/components/CourseList/components/Courses'
>>>>>>> feat: infinite scroll with loading icon

export interface CourseListProps {}

export const CourseList: React.FC<CourseListProps> = () => {
<<<<<<< refs/remotes/origin/dev
  const { courseSearchQuery, fetchMoreCourses } = useContext(CourseSearchContext)

  const { data, loading, error } = courseSearchQuery as QueryResult<SearchCourseResponse, SearchCourseVars>

  const handleReachedBottom = async () => {
    try {
      if (!loading) {
        await fetchMoreCourses()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleScroll = () => {
    const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight

    if (bottom) {
      console.log('At bottom')
      handleReachedBottom()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  if (!courseSearchQuery) return null

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {data?.search.map((result) => (
        <RenderOnIntersect key={result.courseNo} id={result.courseNo} initialHeight={158}>
          <CourseCard key={result.courseNo} course={result} />
        </RenderOnIntersect>
      ))}
      {loading && <Loading />}
      {error && <Error message={error.message} />}
    </Stack>
=======
  const { courses, loading, error } = useCourseList()

  return (
    <>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Courses loading={loading} courses={courses || []} />
        <Loading loading={loading} />
        {error && <Error message={error.message} />}
      </Stack>
    </>
>>>>>>> feat: infinite scroll with loading icon
  )
}
