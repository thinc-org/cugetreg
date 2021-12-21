import { ApolloClient, isApolloError, NormalizedCacheObject } from '@apollo/client'
import { Course } from '@thinc-org/chula-courses'
import { observer } from 'mobx-react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { CourseGroup } from '@/common/hooks/useCourseGroup/types'
import { useLinkBuilder } from '@/common/hooks/useLinkBuilder'
import { parseCourseGroup } from '@/common/utils/parseCourseGroup'
import { Loading } from '@/modules/CourseSearch/components/Loading'
import { createApolloServerClient } from '@/services/apollo'
import { GetCourseResponse, GET_COURSE } from '@/services/apollo/query/getCourse'
import { courseCartStore } from '@/store'
import { userStore } from '@/store/userStore'

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
  const { buildLink } = useLinkBuilder()

  useEffect(() => {
    const fn = async () => {
      await userStore.waitUntilInitialized()
      await courseCartStore.upgradeSource()

      items.forEach(({ course, sectionNo }) => {
        courseCartStore.addItem(course, sectionNo)
      })
      router.replace(buildLink(`/schedule`))
    }
    fn()
  }, [items, router, buildLink])

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
  } catch (e: unknown) {
    if (isApolloError(e as Error)) {
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
