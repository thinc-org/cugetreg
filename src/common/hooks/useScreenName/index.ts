import { useRouter } from 'next/router'

import { ScreenName } from './constants'

function useScreenName(): ScreenName | undefined {
  const { pathname } = useRouter()

  if (pathname.match(/^\/S\/course\/\d+(\?)?/)) return ScreenName.CourseDetail
  if (pathname.match(/^\/S\/course(\?)?/)) return ScreenName.CourseSearch
  if (pathname.match(/^\/S\/schedule\/cr11(\?)?/)) return ScreenName.CR11
  if (pathname.match(/^\/S\/schedule(\?)?/)) return ScreenName.Schedule

  return undefined
}

export default useScreenName
