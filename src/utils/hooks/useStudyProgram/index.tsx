import { StudyProgram } from '@thinc-org/chula-courses'
import { useRouter } from 'next/router'

export default function useStudyPromgram() {
  const router = useRouter()

  const studyProgram = (router.pathname as string).split('/')

  const setStudyProgram = (program: StudyProgram) => {
    const splittedPathName = (router.pathname as string).split('/')
    splittedPathName[1] = program
    const newPathName = splittedPathName.join('/')
    router.push(newPathName)
  }

  return { studyProgram, setStudyProgram }
}
