import { useState, useContext } from 'react'
import { Hidden, Stack as MuiStack, Typography } from '@material-ui/core'
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
import { Analytics } from '@/context/analytics/components/Analytics'
import { FILTER_BUTTON, SELECTED_COURSES_BUTTON, OPEN_SHOPPING_CART_BUTTON } from '@/context/analytics/components/const'

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
      <TitleStack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h2">ค้นหาวิชาเรียน</Typography>
        <Hidden mdUp>
          <Analytics elementName={OPEN_SHOPPING_CART_BUTTON}>
            {({ log }) => (
              <SelectedCoursesButton
                onClick={() => {
                  log()
                  onOpen()
                }}
              />
            )}
          </Analytics>
        </Hidden>
      </TitleStack>
      <StickyStack alignItems="flex-start">
        <Stack width="100%" spacing={2} direction="row">
          <SearchField />
          <Analytics elementName={FILTER_BUTTON}>
            {({ log }) => (
              <FilterIconButton
                onClick={() => {
                  log()
                  setOpenFilterBar((open) => !open)
                }}
              />
            )}
          </Analytics>
          <Hidden mdDown>
            <Analytics elementName={SELECTED_COURSES_BUTTON}>
              {({ log }) => (
                <SelectedCoursesButton
                  onClick={() => {
                    onOpen()
                    log()
                  }}
                />
              )}
            </Analytics>
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

const CourseSearchPageWithCourseSearchProvider = () => {
  return (
    <CourseSearchProvider>
      <CourseSearchPage />
    </CourseSearchProvider>
  )
}

export default CourseSearchPageWithCourseSearchProvider
