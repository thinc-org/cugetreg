import { act, renderHook } from '@testing-library/react-hooks'

describe('', () => {
  it('Should toggleFilterBar and handleClose FilterBar correctly', async () => {
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
})
