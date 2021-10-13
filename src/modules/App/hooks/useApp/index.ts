import { StudyProgramEnum } from '@thinc-org/chula-courses'
import { Router } from 'next/router'
import { useEffect } from 'react'

import { courseCartStore } from '@/store'
import { userStore } from '@/store/userStore'
import env from '@/utils/env/macro'

import { collectLogEvent } from '../../../../services/logging'
import { removeElement } from '../../utils/removeElement'
import { useLogging } from '../useLogging'

export function useApp(router: Router) {
  useLogging()

  useEffect(() => {
    collectLogEvent({
      kind: 'track',
      message: 'Session started',
    })
    courseCartStore.upgradeSource()
    userStore.restoreSession().then(() => courseCartStore.upgradeSource())
  }, [])

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
