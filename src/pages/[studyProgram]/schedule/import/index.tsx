import { ApolloClient, isApolloError, NormalizedCacheObject } from '@apollo/client'
import { Course } from '@thinc-org/chula-courses'
import { observer } from 'mobx-react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useCourseGroup } from '@/common/hooks/useCourseGroup'
import { Loading } from '@/components/Loading'
import { courseCartStore } from '@/store'
import { parseCourseGroup } from '@/utils/courseGroup'
import { CourseGroup, GetCourseResponse, GET_COURSE } from '@/utils/network/BackendGQLQueries'
import { createApolloServerClient } from '@/utils/network/apollo'

interface RawScheduleItem {
  courseNo: string
  sectionNo: string
}

interface ScheduleItem {
  course: Course
  sectionNo: string
}

interface ImportPageProps {
  items: ScheduleItem[]
}

function ImportSchedulePage({ items }: ImportPageProps) {
  const router = useRouter()
  const { studyProgram } = useCourseGroup()
  const { isInitialized, isInitializedLocal } = courseCartStore
  const ready = isInitialized || isInitializedLocal

  useEffect(() => {
    if (!ready) {
      return
    }
    items.forEach(({ course, sectionNo }) => {
      courseCartStore.addItem(course, sectionNo)
    })
    router.replace(`/${studyProgram}/schedule`)
  }, [items, router, studyProgram, ready])

  return <Loading loading />
}

// TODO: research security issues for importing from other 3rd party data sources
const whitelistedOrigins = ['https://esc.eng.chula.ac.th', 'http://localhost:8000']

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ImportPageProps>> {
  const referer = context.req.headers.referer as string
  const isFromWhitelistedOrigins = whitelistedOrigins.some((origin) => {
    return typeof referer === 'string' && referer.startsWith(origin)
  })
  if (!isFromWhitelistedOrigins) {
    return {
      notFound: true,
    }
  }
  try {
    const client = createApolloServerClient()
    const q = context.query
    const courseGroup = parseCourseGroup(q)
    const itemsQuery = (q.items as string) ?? ''
    const rawItems = itemsQuery
      .split(',')
      .map((it) => {
        if (it.length === 0) {
          return null
        }
        const parts = it.split(':')
        if (parts.length !== 2) {
          throw new Error('expected 2 parts for each item')
        }
        return {
          courseNo: parts[0],
          sectionNo: parts[1],
        }
      })
      .filter((it) => it !== null) as RawScheduleItem[]
    const items = await Promise.all(rawItems.map((it) => fetchItem(client, courseGroup, it)))
    return {
      props: {
        items,
      },
    }
  } catch (e) {
    if (isApolloError(e)) {
      return {
        notFound: true,
      }
    } else {
      throw e
    }
  }
}

async function fetchItem(
  client: ApolloClient<NormalizedCacheObject>,
  courseGroup: CourseGroup,
  item: RawScheduleItem
): Promise<ScheduleItem> {
  const { courseNo, sectionNo } = item
  const {
    data: { course },
  } = await client.query<GetCourseResponse>({
    query: GET_COURSE,
    variables: {
      courseNo: courseNo,
      courseGroup,
    },
  })
  return {
    course,
    sectionNo,
  }
}

export default observer(ImportSchedulePage)
