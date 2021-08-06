import { renderHook } from '@testing-library/react-hooks'

import { ScreenName } from './constants'

describe('useScreenName', () => {
  const mockCourseSearchPath = '/S/course'
  const mockCourseDetailPath = '/S/course/0123101'
  const mockSchedulePath = '/S/schedule'
  const mockCR11Path = '/S/schedule/cr11'

  const useRouterSpy = jest.fn()

  afterEach(() => {
    jest.resetAllMocks()
    jest.resetModules()
  })

  it.each`
    pathname                | expectedScreenName
    ${mockCourseSearchPath} | ${ScreenName.CourseSearch}
    ${mockCourseDetailPath} | ${ScreenName.CourseDetail}
    ${mockSchedulePath}     | ${ScreenName.Schedule}
    ${mockCR11Path}         | ${ScreenName.CR11}
  `('should return courseSearch screen name', async ({ pathname, expectedScreenName }) => {
    jest.doMock('next/router', () => ({
      useRouter: useRouterSpy.mockReturnValue({
        asPath: pathname,
      }),
    }))
    const { useScreenName } = await import('.')
    const { result } = renderHook(() => useScreenName())

    expect(useRouterSpy).toBeCalledTimes(1)
    expect(result.current).toBe(expectedScreenName)
  })

  it.each`
    pathname                | expectedScreenName
    ${mockCourseSearchPath} | ${ScreenName.CourseSearch}
    ${mockCourseDetailPath} | ${ScreenName.CourseDetail}
    ${mockSchedulePath}     | ${ScreenName.Schedule}
    ${mockCR11Path}         | ${ScreenName.CR11}
  `('should return courseSearch screen name with query params', async ({ pathname, expectedScreenName }) => {
    jest.doMock('next/router', () => ({
      useRouter: useRouterSpy.mockReturnValue({
        asPath: `${pathname}?query="example"`,
      }),
    }))
    const { useScreenName } = await import('.')
    const { result } = renderHook(() => useScreenName())

    expect(useRouterSpy).toBeCalledTimes(1)
    expect(result.current).toBe(expectedScreenName)
  })
})
