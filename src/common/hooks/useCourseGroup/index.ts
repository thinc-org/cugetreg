import { StudyProgram } from '@thinc-org/chula-courses'
import { omit } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef } from 'react'

import { DEFAULT_STUDY_PROGRAM } from '@/common/hooks/useCourseGroup/constants'
import { parseCourseGroup } from '@/common/utils/parseCourseGroup'

import { CourseGroupResult } from './types'

let lastStudyProgram = DEFAULT_STUDY_PROGRAM
if (typeof window !== 'undefined') {
  const storedStudyProgram = localStorage.getItem('studyProgram') as StudyProgram | null
  if (storedStudyProgram !== null) {
    lastStudyProgram = storedStudyProgram
  }
}

export function useCourseGroup(): CourseGroupResult {
  const router = useRouter()
  const courseGroup = parseCourseGroup(router.query, lastStudyProgram)

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

export function useSaveStudyProgram() {
  const { studyProgram } = useCourseGroup()
  useEffect(() => {
    lastStudyProgram = studyProgram
    localStorage.setItem('studyProgram', studyProgram)
  }, [studyProgram])
}
