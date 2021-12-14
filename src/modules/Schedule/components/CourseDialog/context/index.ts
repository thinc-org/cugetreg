import { createContext, useContext } from 'react'

import { CourseDialogContextValue } from '@/modules/Schedule/components/CourseDialog/context/types'

export const CourseDialogContext = createContext(null as unknown as CourseDialogContextValue)

export function useCourseDialog() {
  return useContext(CourseDialogContext)
}
