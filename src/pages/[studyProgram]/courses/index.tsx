import { useState, useContext } from 'react'
import { Button, Hidden, Stack as MuiStack, Typography } from '@material-ui/core'
import { CourseList } from '@/components/CourseList'
import { SearchField } from '@/components/SearchField'
import { FilterIconButton } from '@/components/FilterIconButton'
import { SelectedCoursesButton } from '@/components/SelectedCoursesButton'
import { FilterSection } from '@/components/FilterSection'
import styled from '@emotion/styled'
import { TagList } from '@/components/TagList'
import React from 'react'
import { ShoppingCartModalContext } from '@/context/ShoppingCartModal'
import { CourseSearchProvider } from '@/context/CourseSearch'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { SearchCourseResponse, SearchCourseVars, SEARCH_COURSE } from '@/utils/network/BackendGQLQueries'
import { client } from '@/utils/network/apollo'
import { extractSearchVarsFromQuery } from '@/utils/hooks/useSearchCourseQueryParams'
import { currentTerm } from '@/utils/courseGroup'
import { StudyProgram } from '@thinc-org/chula-courses'
import { collectErrorLog } from '@/utils/network/logging'

const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
`

const TitleStack = styled(MuiStack)`
  margin: 0;
`

const Stack = styled(MuiStack)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StickyStack = styled(MuiStack)`
  position: sticky;
  top: 0;
  margin-bottom: 0;
  padding-top: ${({ theme }) => theme.spacing(3)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  z-index: ${({ theme }) => theme.zIndex.appBar + 1};
  background: white;
  button {
    background: ${({ theme }) => theme.palette.background.default};
  }
`

function CourseSearchPage() {
  const [openFilterBar, setOpenFilterBar] = useState(false)

  const { onOpen } = useContext(ShoppingCartModalContext)

  return (
    <Container>
      <TitleStack spacing={2} direction="row" justifyContent="space-between">
        <Typography variant="h2">ค้นหาวิชาเรียน</Typography>
        <Hidden mdUp>
          <SelectedCoursesButton onClick={onOpen} />
        </Hidden>
      </TitleStack>
      <StickyStack alignItems="flex-start">
        <Stack width="100%" spacing={2} direction="row">
          <SearchField />
          <FilterIconButton onClick={() => setOpenFilterBar((open) => !open)} />
          <Hidden mdDown>
            <SelectedCoursesButton onClick={onOpen} />
          </Hidden>
        </Stack>
        <TagList />
      </StickyStack>
      <Stack spacing={3} direction="row">
        <CourseList />
        <FilterSection open={openFilterBar} setOpen={setOpenFilterBar} />
      </Stack>
    </Container>
  )
}

const CourseSearchPageWithCourseSearchProvider = (props: { prefetch?: SearchPagePrefetchData }) => {
  return (
    <CourseSearchProvider cache={props.prefetch}>
      <CourseSearchPage />
    </CourseSearchProvider>
  )
}

export interface SearchPagePrefetchData {
  vars: SearchCourseVars
  data: SearchCourseResponse
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ prefetch?: SearchPagePrefetchData }>> {
  try {
    const vars: SearchCourseVars = extractSearchVarsFromQuery(context.query, {
      ...currentTerm,
      studyProgram: context.query.studyProgram as StudyProgram,
    })
    const result = await client.query<SearchCourseResponse, SearchCourseVars>({
      query: SEARCH_COURSE,
      variables: vars,
    })
    return { props: { prefetch: { data: result.data, vars } } }
  } catch (e) {
    collectErrorLog('Search Page SSR Fetch Failed', e)
    return { props: {} }
  }
}

export default CourseSearchPageWithCourseSearchProvider
