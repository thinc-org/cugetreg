import { StudyProgramEnum } from '@thinc-org/chula-courses'
import { Router } from 'next/router'
import { useEffect } from 'react'

import { useSnackBar } from '@/context/Snackbar/hooks'
import env from '@/utils/env/macro'

import removeElement from '../../utils/removeElement'
import useGapi from '../useGapi'
import useLogging from '../useLogging'
import { UseAppProps } from './types'

export default function useApp(router: Router): UseAppProps {
  const { message, emitMessage, action: actionText, open, close, messageType } = useSnackBar()

  const handleClose = (_: unknown, reason: string) => {
    if (reason === 'clickaway') {
      return
    }

    close()
  }

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

  return {
    open,
    message,
    emitMessage,
    handleClose,
    messageType,
    actionText,
  }
}
