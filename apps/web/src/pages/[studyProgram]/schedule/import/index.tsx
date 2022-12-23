import { useEffect } from 'react'

import { ApolloClient, NormalizedCacheObject, isApolloError } from '@apollo/client'
import { observer } from 'mobx-react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'

import { CourseGroup } from '@web/common/hooks/useCourseGroup/types'
import { useLinkBuilder } from '@web/common/hooks/useLinkBuilder'
import { parseCourseGroup } from '@web/common/utils/parseCourseGroup'
import { Loading } from '@web/modules/CourseSearch/components/Loading'
import { createApolloServerClient } from '@web/services/apollo'
import { courseCartStore } from '@web/store'
import { userStore } from '@web/store/userStore'

import {
  Course,
  GetCourseInfoDocument,
  GetCourseInfoQuery,
  GetCourseInfoQueryVariables,
} from '@libs/codegen'

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
  } = await client.query<GetCourseInfoQuery, GetCourseInfoQueryVariables>({
    query: GetCourseInfoDocument,
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
