import { ThemeProvider } from '@material-ui/core'
import { render } from '@testing-library/react'
import React from 'react'
import TestRenderer from 'react-test-renderer'

import { mockAndShallowSpy } from '@/common/testing/mockAndShallowSpy'
import { lightTheme } from '@/configs/theme'

describe('CourseSearchPage', () => {
  const MockCourseSearchProvider: React.FC = ({ children }) => <>{children}</>
  const MockAnalytics: React.FC = ({ children }) => <>{children}</>
  jest.doMock('./context/CourseSearch', () => ({
    CourseSearchProvider: MockCourseSearchProvider,
  }))
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
  jest.doMock('@/modules/CourseSearch/components/SearchField', () => ({
    SearchField: () => <>SearchField</>,
  }))
  jest.doMock('@/modules/CourseSearch/components/TagList', () => ({
    TagList: () => <>TagList</>,
    NoTagListLayout: () => <>NoTagListLayout</>,
  }))
  jest.doMock('@/modules/CourseSearch/components/CourseList', () => ({
    CourseList: () => <>CourseList</>,
  }))
  jest.doMock('@/common/context/Analytics/components/Analytics', () => ({
    Analytics: MockAnalytics,
  }))
  const mockFilterSection = jest.fn(() => <>FilterSection</>)
  jest.doMock('@/modules/CourseSearch/components/FilterSection', () => ({
    FilterSection: mockFilterSection,
  }))

  const MaterialUIProvider: React.FC = ({ children }) => {
    return <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
  }

  it('Should match snapshot correctly', async () => {
    const { CourseSearchPageWithCourseSearchProvider } = await import('.')

    const { asFragment } = render(
      <MaterialUIProvider>
        <CourseSearchPageWithCourseSearchProvider />
      </MaterialUIProvider>
    )
    const tree = asFragment()
    expect(tree).toMatchSnapshot()
    expect(mockFilterSection).toBeCalledTimes(1)
    expect(mockFilterSection.mock.calls[0][0]).toEqual({ open: mockOpenFilterBar, setOpen: mockSetOpenFilterBar })
  })
})
