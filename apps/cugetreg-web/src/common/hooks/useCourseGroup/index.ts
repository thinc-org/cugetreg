import { useCallback, useEffect, useRef } from 'react'

import { StudyProgram } from '@thinc-org/chula-courses'
import { useRouter } from 'next/router'

import { DEFAULT_STUDY_PROGRAM } from '@web/common/hooks/useCourseGroup/constants'
import { Storage } from '@web/common/storage'
import { StorageKey } from '@web/common/storage/constants'
import { parseCourseGroup } from '@web/common/utils/parseCourseGroup'

import { CourseGroupResult } from './types'

const storage = new Storage('localStorage')

let lastStudyProgram = DEFAULT_STUDY_PROGRAM
if (typeof window !== 'undefined') {
  const storedStudyProgram = storage.get<StudyProgram>(StorageKey.StudyProgram)
  if (typeof storedStudyProgram !== 'undefined') {
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
        // we can't set it by changing path, so just set lastStudyProgram and trigger navigation
        lastStudyProgram = newStudyProgram
        router.replace(router.asPath)
        return
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
      const { studyProgram, ...routerQuery } = router.query
      const query = {
        ...routerQuery,
        term: term,
      }
      router.push({
        pathname: router.asPath.split('?')[0],
        query,
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
    storage.set(StorageKey.StudyProgram, studyProgram)
  }, [studyProgram])
}
