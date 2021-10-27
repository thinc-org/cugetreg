import { StudyProgram } from '@thinc-org/chula-courses'
import { omit } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useRef } from 'react'

import { parseCourseGroup } from '@/common/utils/parseCourseGroup'

import { CourseGroupResult } from './types'

export function useCourseGroup(): CourseGroupResult {
  const router = useRouter()
  const courseGroup = parseCourseGroup(router.query)

  const currentCourseGroup = useRef(courseGroup)
  currentCourseGroup.current = courseGroup

  const setStudyProgram = useCallback(
    (newStudyProgram: StudyProgram) => {
      const splittedPathname = (router.pathname as string).split('/')
      if (splittedPathname[1] !== '[studyProgram]') {
        throw new Error('The first path is not [studyProgram]')
      }
      const splittedAsPath = (router.asPath as string).split('/')
      splittedAsPath[1] = newStudyProgram
      const newPathName = splittedAsPath.join('/')
      router.push(newPathName)
    },
    [router]
  )

  const setTerm = useCallback(
    (term: string) => {
      const query = {
        ...router.query,
        term: term,
      }
      router.push({
        pathname: router.asPath.split('?')[0],
        query: omit(query, ['studyProgram']),
      })
    },
    [router]
  )

  return {
    ...courseGroup,
    setStudyProgram,
    setTerm,
  }
}
