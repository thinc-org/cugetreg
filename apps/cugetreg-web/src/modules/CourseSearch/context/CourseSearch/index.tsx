import React, { createContext } from 'react'

import { DEFAULT_COURSE_SEARCH_CONTEXT_VALUE } from '@web/modules/CourseSearch/context/CourseSearch/constants'
import { useCourseSearchProvider } from '@web/modules/CourseSearch/context/CourseSearch/hooks/useCourseSearchProvider'

export const CourseSearchContext = createContext(DEFAULT_COURSE_SEARCH_CONTEXT_VALUE)

export const CourseSearchProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const { courseSearchQuery, fetchMoreCourses } = useCourseSearchProvider()

  const value = { courseSearchQuery, fetchMoreCourses }

  return <CourseSearchContext.Provider value={value} {...props} />
}
