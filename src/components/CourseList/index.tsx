import React, { useContext, useEffect } from 'react'

import { Stack } from '@material-ui/core'
import { CourseCard } from '@/components/CourseCard'
import { CourseSearchContext } from '@/context/CourseSearch'
import { Loading } from '@/components/Loading'
import { Error } from '@/components/Error'
import { RenderOnIntersect } from '../RenderOnIntersect'
import { QueryResult } from '@apollo/client'
import { SearchCourseResponse, SearchCourseVars } from '@/utils/network/BackendGQLQueries'

export interface CourseListProps {}

export const CourseList: React.FC<CourseListProps> = () => {
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
  )
}
