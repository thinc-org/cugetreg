import { act, renderHook } from '@testing-library/react-hooks'

describe('useCourseSearchPage', () => {
  const mockUseMeiaQuery = jest.fn()
  jest.doMock('@material-ui/core', () => ({
    useMediaQuery: mockUseMeiaQuery,
    useTheme: jest.fn(() => ({ breakpoints: { up: jest.fn() } })),
  }))

  it('Should toggleFilterBar and handleClose FilterBar correctly', async () => {
    mockUseMeiaQuery.mockReturnValue(false)
    const { useCourseSearchPage } = await import('.')
    const { result } = renderHook(() => useCourseSearchPage())

    expect(result.current.openFilterBar).toBe(false)
    act(() => {
      result.current.toggleFilterBar()
    })
    expect(result.current.openFilterBar).toBe(true)
    act(() => {
      result.current.toggleFilterBar()
    })
    expect(result.current.openFilterBar).toBe(false)

    act(() => {
      result.current.handleCloseFilterBar()
    })
    expect(result.current.openFilterBar).toBe(false)
    act(() => {
      result.current.toggleFilterBar()
    })
    expect(result.current.openFilterBar).toBe(true)
    act(() => {
      result.current.handleCloseFilterBar()
    })
    expect(result.current.openFilterBar).toBe(false)
  })

  it('Should open filter bar by default is on desktop', async () => {
    mockUseMeiaQuery.mockReturnValue(true)

    const { useCourseSearchPage } = await import('.')
    const { result } = renderHook(() => useCourseSearchPage())
    // await waitForValueToChange()
    expect(result.current.openFilterBar).toBe(true)
  })
})
