import { StudyProgram } from '@cugetreg/codegen'

import { useEffect } from 'react'

import { Router } from 'next/router'

import { ENABLE_DARK_THEME } from '@web/env'
import { collectLogEvent } from '@web/services/logging'
import { courseCartStore } from '@web/store'
import { userStore } from '@web/store/userStore'

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
    userStore.waitUntilInitialized().then(() => courseCartStore.upgradeSource())
  }, [])

  useEffect(() => {
    removeElement('jss-server-side')
    if (ENABLE_DARK_THEME) {
      removeElement('cgr-dark')
    }
  })

  useEffect(() => {
    const studyProgram = router.query.studyProgram as string
    if (studyProgram && !(Object.values(StudyProgram) as string[]).includes(studyProgram)) {
      router.replace('/')
    }
    // eslint-disable-next-line
  }, [router.query])
}
