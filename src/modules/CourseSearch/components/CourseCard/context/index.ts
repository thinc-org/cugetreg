import { createContext, useContext } from 'react'

import { CourseCardContextValue } from '@/modules/CourseSearch/components/CourseCard/context/types'

export const CourseCardContext = createContext((null as unknown) as CourseCardContextValue)

export function useCourseCard() {
  return useContext(CourseCardContext)
}
