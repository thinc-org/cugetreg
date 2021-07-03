import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { createApolloServerClient } from '@/utils/network/apollo'
import { extractSearchVarsFromQuery } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'
import { currentTerm } from '@/utils/courseGroup'
import { StudyProgram } from '@thinc-org/chula-courses'
import { collectErrorLog } from '@/utils/network/logging'
import { CourseSearchPagePrefetchData } from '@/modules/CourseSearch/types'
import CourseSearchPageWithCourseSearchProvider from '@/modules/CourseSearch'

export default CourseSearchPageWithCourseSearchProvider

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ prefetch?: CourseSearchPagePrefetchData }>> {
  try {
    const vars: SearchCourseVars = extractSearchVarsFromQuery(context.query, {
      ...currentTerm,
      studyProgram: context.query.studyProgram as StudyProgram,
    })
    const client = createApolloServerClient()
    const result = await client.query<SearchCourseResponse, SearchCourseVars>({
      query: SEARCH_COURSE,
      variables: vars,
    })
    return { props: { prefetch: { data: result.data, vars } } }
  } catch (e) {
    collectErrorLog(`Search Page SSR Fetch Failed for query ${context.query}`, e)
    return { props: {} }
  }
}
