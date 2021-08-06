import { Hidden, Typography } from '@material-ui/core'
import { StudyProgram } from '@thinc-org/chula-courses'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useState, useContext } from 'react'
import React from 'react'

import { PageMeta } from '@/components/PageMeta'
import { ShoppingCartModalContext } from '@/context/ShoppingCartModal'
import { Analytics } from '@/context/analytics/components/Analytics'
import { FILTER_BUTTON, SELECTED_COURSES_BUTTON, OPEN_SHOPPING_CART_BUTTON } from '@/context/analytics/components/const'
import { CourseList } from '@/modules/CourseSearch/component/CourseList'
import { FilterIconButton } from '@/modules/CourseSearch/component/FilterIconButton'
import { FilterSection } from '@/modules/CourseSearch/component/FilterSection'
import { SearchField } from '@/modules/CourseSearch/component/SearchField'
import { SelectedCoursesButton } from '@/modules/CourseSearch/component/SelectedCoursesButton'
import { NoTagListLayout, TagList } from '@/modules/CourseSearch/component/TagList'
import { CourseSearchProvider } from '@/modules/CourseSearch/context/CourseSearch'
import { extractSearchVarsFromQuery } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'
import { Container, Stack, TitleStack, StickyStack } from '@/modules/CourseSearch/styles'
import { CourseSearchPagePrefetchData } from '@/modules/CourseSearch/types'
import { currentTerm } from '@/utils/courseGroup'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { createApolloServerClient } from '@/utils/network/apollo'
import { collectErrorLog } from '@/utils/network/logging'

function CourseSearchPage() {
  const [openFilterBar, setOpenFilterBar] = useState(false)

  const { onOpen } = useContext(ShoppingCartModalContext)

  return (
    <Container>
      <PageMeta title="ค้นหาวิชาเรียน" />
      <TitleStack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">ค้นหาวิชาเรียน</Typography>
        <Hidden mdUp>
          <Analytics elementName={OPEN_SHOPPING_CART_BUTTON}>
            <SelectedCoursesButton onClick={onOpen} />
          </Analytics>
        </Hidden>
      </TitleStack>
      <StickyStack alignItems="flex-start">
        <Stack width="100%" spacing={2} direction="row">
          <SearchField />
          <Analytics elementName={FILTER_BUTTON}>
            <FilterIconButton
              onClick={() => {
                setOpenFilterBar((open) => !open)
              }}
            />
          </Analytics>
          <Hidden mdDown>
            <Analytics elementName={SELECTED_COURSES_BUTTON}>
              <SelectedCoursesButton onClick={onOpen} />
            </Analytics>
          </Hidden>
        </Stack>
        <TagList />
      </StickyStack>
      <NoTagListLayout />
      <Stack spacing={3} direction="row">
        <CourseList />
        <FilterSection open={openFilterBar} setOpen={setOpenFilterBar} />
      </Stack>
    </Container>
  )
}

const CourseSearchPageWithCourseSearchProvider = (props: { prefetch?: CourseSearchPagePrefetchData }) => {
  return (
    <CourseSearchProvider cache={props.prefetch}>
      <CourseSearchPage />
    </CourseSearchProvider>
  )
}

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
