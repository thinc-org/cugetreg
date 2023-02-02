import { useContext, useEffect } from 'react'

import { CourseSearchContext } from '@web/modules/CourseSearch/context/CourseSearch'

import { SearchCourseQueryResult } from '@cgr/codegen'

export const useCourseList = () => {
  const BOTTOM_OFFSET = 500

  const { courseSearchQuery, fetchMoreCourses } = useContext(CourseSearchContext)

  const { data, loading, error } = courseSearchQuery as SearchCourseQueryResult

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
