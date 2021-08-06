import { useRouter } from 'next/router'

import { ScreenName } from './constants'

export function useScreenName(): ScreenName | undefined {
  const { asPath } = useRouter()

  switch (true) {
    case /^\/S\/course\/\d+(\?)?/.test(asPath):
      return ScreenName.CourseDetail
    case /^\/S\/course(\?)?/.test(asPath):
      return ScreenName.CourseSearch
    case /^\/S\/schedule\/cr11(\?)?/.test(asPath):
      return ScreenName.CR11
    case /^\/S\/schedule(\?)?/.test(asPath):
      return ScreenName.Schedule
  }

  return undefined
}
