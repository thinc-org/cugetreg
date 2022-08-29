import { useContext, useEffect } from 'react'

import { QueryResult } from '@apollo/client'

import { CourseSearchContext } from '@web/modules/CourseSearch/context/CourseSearch'
import { SearchCourseResponse, SearchCourseVars } from '@web/services/apollo/query/searchCourse'

export const useCourseList = () => {
  const BOTTOM_OFFSET = 500

  const { courseSearchQuery, fetchMoreCourses } = useContext(CourseSearchContext)

  const { data, loading, error } = courseSearchQuery as QueryResult<
    SearchCourseResponse,
    SearchCourseVars
  >

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
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight - BOTTOM_OFFSET

    if (bottom) {
      handleReachedBottom()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    courses: data?.search || [],
    loading,
    error,
  }
}
