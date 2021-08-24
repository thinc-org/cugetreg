import { createContext, useContext } from 'react'

import { CourseCardContextValue } from './types'

export const CourseCardContext = createContext((null as unknown) as CourseCardContextValue)

export function useCourseCardContext() {
  return useContext(CourseCardContext)
}
