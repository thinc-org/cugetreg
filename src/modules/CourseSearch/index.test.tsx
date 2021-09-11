import { shallow } from 'enzyme'
import React from 'react'

describe('CourseSearchPage', () => {
  const mockOpenFilterBar = false
  const mockSetOpenFilterBar = jest.fn()
  const mockUseCourseSearchPage = jest.fn(() => ({
    openFilterBar: mockOpenFilterBar,
    setOpenFilterBar: mockSetOpenFilterBar,
    onOpen: jest.fn(),
  }))
  jest.doMock('./hooks/useCourseSearchPage', () => ({
    useCourseSearchPage: mockUseCourseSearchPage,
  }))

  it('Should match snapshot correctly', async () => {
    const { CourseSearchPage } = await import('.')

    const wrapper = shallow(<CourseSearchPage />)
    expect(wrapper).toMatchInlineSnapshot(`
<Styled(div)>
  <PageMeta
    title="ค้นหาวิชาเรียน"
  />
  <Styled(Component)
    alignItems="center"
    direction="row"
    justifyContent="space-between"
    spacing={2}
  >
    <ForwardRef(Typography)
      variant="h2"
    >
      ค้นหาวิชาเรียน
    </ForwardRef(Typography)>
    <Hidden
      mdUp={true}
    >
      <Analytics
        elementName="open_shopping_cart_button"
      >
        <Memo(wrappedComponent)
          onClick={[MockFunction]}
        />
      </Analytics>
    </Hidden>
  </Styled(Component)>
  <Styled(Component)
    alignItems="flex-start"
  >
    <Styled(Component)
      direction="row"
      spacing={2}
      width="100%"
    >
      <SearchField />
      <Analytics
        elementName="filter_button"
      >
        <FilterIconButton
          onClick={[Function]}
        />
      </Analytics>
      <Hidden
        mdDown={true}
      >
        <Analytics
          elementName="selected_courses_button"
        >
          <Memo(wrappedComponent)
            onClick={[MockFunction]}
          />
        </Analytics>
      </Hidden>
    </Styled(Component)>
    <TagList />
  </Styled(Component)>
  <NoTagListLayout />
  <Styled(Component)
    direction="row"
    spacing={3}
  >
    <CourseList />
    <FilterSection
      open={false}
      setOpen={[MockFunction]}
    />
  </Styled(Component)>
</Styled(div)>
`)
  })
})
