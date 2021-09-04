import { StudyProgram } from '@thinc-org/chula-courses'
import { useRouter } from 'next/router'
import { useCallback, useRef } from 'react'

import { parseCourseGroup } from '../../utils/parseCourseGroup'
import { CourseGroupResult } from './types'

const notImplemented = () => {
  throw new Error('not implemented yet')
}

export function useCourseGroup(): CourseGroupResult {
  const router = useRouter()
  const courseGroup = parseCourseGroup(router.query)
  const currentCourseGroup = useRef(courseGroup)
  currentCourseGroup.current = courseGroup

  const setStudyProgram = useCallback(
    (newStudyProgram: StudyProgram) => {
      const splittedPathname = (router.pathname as string).split('/')
      if (splittedPathname[1] !== '[studyProgram]') {
        throw new Error('first path is not [studyProgram]')
      }
      const splittedAsPath = (router.asPath as string).split('/')
      splittedAsPath[1] = newStudyProgram
      const newPathName = splittedAsPath.join('/')
      router.push(newPathName)
    },
    [router]
  )

  return {
    ...courseGroup,
    setStudyProgram,
    setYear: notImplemented,
    setSemester: notImplemented,
  }
}
