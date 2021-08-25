import { Hidden, Typography } from '@material-ui/core'
import { StudyProgram } from '@thinc-org/chula-courses'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useState, useContext } from 'react'
import React from 'react'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import {
  FILTER_BUTTON,
  SELECTED_COURSES_BUTTON,
  OPEN_SHOPPING_CART_BUTTON,
} from '@/common/context/Analytics/components/const'
import { ShoppingCartModalContext } from '@/common/context/ShoppingCartModal'
import { PageMeta } from '@/components/PageMeta'
import { CourseList } from '@/modules/CourseSearch/components/CourseList'
import { FilterIconButton } from '@/modules/CourseSearch/components/FilterIconButton'
import { FilterSection } from '@/modules/CourseSearch/components/FilterSection'
import { SearchField } from '@/modules/CourseSearch/components/SearchField'
import { SelectedCoursesButton } from '@/modules/CourseSearch/components/SelectedCoursesButton'
import { NoTagListLayout, TagList } from '@/modules/CourseSearch/components/TagList'
import { CourseSearchProvider } from '@/modules/CourseSearch/context/CourseSearch'
import { extractSearchVarsFromQuery } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'
import { Container, Stack, TitleStack, StickyStack } from '@/modules/CourseSearch/styles'
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

const CourseSearchPageWithCourseSearchProvider = () => {
  return (
    <CourseSearchProvider>
      <CourseSearchPage />
    </CourseSearchProvider>
  )
}

export default CourseSearchPageWithCourseSearchProvider
