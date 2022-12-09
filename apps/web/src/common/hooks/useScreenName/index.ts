import { useRouter } from 'next/router'

import { ScreenName } from './constants'

export function useScreenName(): ScreenName | undefined {
  const { pathname } = useRouter()

  switch (pathname) {
    case '/[studyProgram]/courses/[courseNo]':
      return ScreenName.CourseDetail
    case '/[studyProgram]/courses':
      return ScreenName.CourseSearch
    case '/[studyProgram]/schedule/cr11':
      return ScreenName.CR11
    case '/[studyProgram]/schedule':
      return ScreenName.Schedule
  }

  return undefined
}
