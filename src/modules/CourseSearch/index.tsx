import { useState, useContext } from 'react'
import { Hidden, Typography } from '@material-ui/core'
import { CourseList } from '@/modules/CourseSearch/component/CourseList'
import { SearchField } from '@/modules/CourseSearch/component/SearchField'
import { FilterIconButton } from '@/modules/CourseSearch/component/FilterIconButton'
import { SelectedCoursesButton } from '@/modules/CourseSearch/component/SelectedCoursesButton'
import { FilterSection } from '@/modules/CourseSearch/component/FilterSection'

import { NoTagListLayout, TagList } from '@/modules/CourseSearch/component/TagList'
import React from 'react'
import { ShoppingCartModalContext } from '@/context/ShoppingCartModal'
import { CourseSearchProvider } from '@/modules/CourseSearch/context/CourseSearch'
import { Analytics } from '@/context/analytics/components/Analytics'
import { FILTER_BUTTON, SELECTED_COURSES_BUTTON, OPEN_SHOPPING_CART_BUTTON } from '@/context/analytics/components/const'
import { Container, Stack, TitleStack, StickyStack } from '@/modules/CourseSearch/styles'
import { CourseSearchPagePrefetchData } from '@/modules/CourseSearch/types'

function CourseSearchPage() {
  const [openFilterBar, setOpenFilterBar] = useState(false)

  const { onOpen } = useContext(ShoppingCartModalContext)

  return (
    <Container>
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
