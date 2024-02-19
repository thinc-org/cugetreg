import { act, renderHook } from '@testing-library/react-hooks'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { stubFalse } from '@web/utils/stubFalse'

describe('useCourseSearchProvider', () => {
  const mockQuery = { text: 'text' }
  const mockQueryParam = { param: 'param', filter: { a: 'a' } }
  const mockFetchMoreResult = { data: { search: { length: 5 } } }

  const mockUseQuery = vi.fn(() => mockUseQueryResult)
  const mockSetIsEmpty = vi.fn()
  const mockFetchMore = vi.fn(() => mockFetchMoreResult)

  const mockUseQueryResult = {
    loading: false,
    fetchMore: mockFetchMore,
    variables: { key: 'variables' },
    refetch: vi.fn(),
  }
  const mockUseEmptyResult = { isEmpty: false, setIsEmpty: mockSetIsEmpty }

  const LIMIT_FETCH_EXPECTED = 15

  vi.doMock('next/router', () => ({
    useRouter: () => ({ query: mockQuery }),
  }))
  vi.doMock('@web/modules/CourseSearch/hooks/useSearchCourseQueryParams', () => ({
    useSearchCourseQueryParams: () => ({
      searchCourseQueryParams: { filter: {}, query: mockQueryParam },
    }),
  }))
  vi.doMock('@apollo/client', () => ({
    useQuery: mockUseQuery,
  }))
  vi.doMock('../useEmpty', () => ({
    useEmpty: () => mockUseEmptyResult,
  }))

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Should fetch more course if result is not empty and not currently loading more courses (isEmpty: false, loading: false)', async () => {
    const { useCourseSearchProvider } = await import('.')
    const { result, waitForNextUpdate } = renderHook(() => useCourseSearchProvider())

    mockUseQueryResult.loading = false
    mockUseEmptyResult.isEmpty = false

    result.current.fetchMoreCourses()
    await waitForNextUpdate()
    result.current.fetchMoreCourses()
    await waitForNextUpdate()
    result.current.fetchMoreCourses()
    await waitForNextUpdate()

    expect(mockFetchMore).toBeCalledTimes(3)
    expect(mockFetchMore).toHaveBeenNthCalledWith(1, {
      variables: {
        filter: {
          limit: LIMIT_FETCH_EXPECTED,
          offset: LIMIT_FETCH_EXPECTED,
        },
        query: mockQueryParam,
      },
    })
    expect(mockFetchMore).toHaveBeenNthCalledWith(2, {
      variables: {
        filter: {
          limit: LIMIT_FETCH_EXPECTED,
          offset: LIMIT_FETCH_EXPECTED * 2,
        },
        query: mockQueryParam,
      },
    })
    expect(mockFetchMore).toHaveBeenNthCalledWith(3, {
      variables: {
        filter: {
          limit: LIMIT_FETCH_EXPECTED,
          offset: LIMIT_FETCH_EXPECTED * 3,
        },
        query: mockQueryParam,
      },
    })
    expect(mockSetIsEmpty).toHaveBeenCalledWith(false)
    expect(mockSetIsEmpty).toBeCalledTimes(1)
  })

  it.each`
    loading      | isEmpty
    ${true}      | ${true}
    ${true}      | ${false}
    ${stubFalse} | ${true}
  `(
    'Should not fetch more course if result is empty or currently loading more courses (isEmpty: $isEmpty, loading: $loading)',
    async ({ loading, isEmpty }) => {
      const { useCourseSearchProvider } = await import('.')
      const { result } = renderHook(() => useCourseSearchProvider())

      mockUseQueryResult.loading = loading
      mockUseEmptyResult.isEmpty = isEmpty
      act(() => {
        result.current.fetchMoreCourses()
      })

      expect(mockSetIsEmpty).toBeCalledTimes(1) // From useEffect hook
      expect(mockSetIsEmpty).toBeCalledWith(false) // From useEffect hook
      expect(mockFetchMore).not.toBeCalled()
    }
  )

  it('Should set empty to prevent fetching more courses when there is no anymore result', async () => {
    mockUseQueryResult.loading = false
    mockUseEmptyResult.isEmpty = false
    mockFetchMoreResult.data.search.length = false as unknown as number
    const { useCourseSearchProvider } = await import('.')
    const { result, waitForNextUpdate } = renderHook(() => useCourseSearchProvider())

    act(() => {
      result.current.fetchMoreCourses()
    })

    await waitForNextUpdate()

    expect(mockFetchMore).toBeCalledTimes(1)
    expect(mockFetchMore).toHaveBeenCalledWith({
      variables: {
        filter: {
          limit: LIMIT_FETCH_EXPECTED,
          offset: LIMIT_FETCH_EXPECTED,
        },
        query: mockQueryParam,
      },
    })
    expect(mockSetIsEmpty).toHaveBeenNthCalledWith(1, false)
    expect(mockSetIsEmpty).toHaveBeenNthCalledWith(2, true)
    expect(mockSetIsEmpty).toBeCalledTimes(2)
  })
})
