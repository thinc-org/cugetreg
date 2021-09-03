import { StudyProgramEnum } from '@thinc-org/chula-courses'
import { Router } from 'next/router'
import { useEffect } from 'react'

import env from '@/utils/env/macro'

import { removeElement } from '../../utils/removeElement'
import { useGapi } from '../useGapi'
import { useLogging } from '../useLogging'

export function useApp(router: Router) {
  useGapi()
  useLogging()

  useEffect(() => {
    removeElement('jss-server-side')
    if (env.features.darkTheme) {
      removeElement('cgr-dark')
    }
  })

  useEffect(() => {
    const studyProgram = router.query.studyProgram as string
    if (studyProgram && !(Object.values(StudyProgramEnum) as string[]).includes(studyProgram)) {
      router.replace('/')
    }
    // eslint-disable-next-line
  }, [router.query])
}
