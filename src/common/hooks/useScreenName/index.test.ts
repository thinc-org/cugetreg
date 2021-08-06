import { renderHook } from '@testing-library/react-hooks'

import { ScreenName } from './constants'

describe('useScreenName', () => {
  const mockCourseSearchPath = '/[studyProgram]/courses'
  const mockCourseDetailPath = '/[studyProgram]/courses/[courseNo]'
  const mockSchedulePath = '/[studyProgram]/schedule'
  const mockCR11Path = '/[studyProgram]/schedule/cr11'

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
        pathname: pathname,
      }),
    }))
    const { useScreenName } = await import('.')
    const { result } = renderHook(() => useScreenName())

    expect(useRouterSpy).toBeCalledTimes(1)
    expect(result.current).toBe(expectedScreenName)
  })
})
