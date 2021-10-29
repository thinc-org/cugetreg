import { act, renderHook } from '@testing-library/react-hooks'

describe('useSelectTime', () => {
  const mockSetFilter = jest.fn()
  const mockSearchCourseQueryParams = { filter: { a: 'a' } }
  const mockUseSearchCourseQueryParams = jest.fn(() => ({
    setFilter: mockSetFilter,
    searchCourseQueryParams: mockSearchCourseQueryParams,
  }))
  jest.doMock('@/modules/CourseSearch/hooks/useSearchCourseQueryParams', () => ({
    useSearchCourseQueryParams: mockUseSearchCourseQueryParams,
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockDefaultStartTime = '09:00'
  const mockDefaultEndTime = '11:00'

  it('Should be able to select startTime and endTime correctly', async () => {
    const { useSelectTime } = await import('.')
    const { result } = renderHook(() => useSelectTime(mockDefaultStartTime, mockDefaultEndTime))

    expect(result.current.selectedStartTime).toEqual(mockDefaultStartTime)
    expect(result.current.selectedEndTime).toEqual(mockDefaultEndTime)
    expect(result.current.startTimeChoices).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00'])
    expect(result.current.endTimeChoices).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00'])

    const mockNewStartTime = '10:00'
    act(() => {
      result.current.onStartTimeChange(mockNewStartTime)
    })

    expect(result.current.selectedStartTime).toEqual(mockNewStartTime)
    expect(result.current.selectedEndTime).toEqual(mockDefaultEndTime)
    expect(result.current.startTimeChoices).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00'])
    expect(result.current.endTimeChoices).toEqual(['10:00', '10:30', '11:00'])
    expect(mockSetFilter).toBeCalledWith({
      ...mockSearchCourseQueryParams.filter,
      periodRange: { start: mockNewStartTime, end: mockDefaultEndTime },
    })

    const mockNewEndTime = '10:30'
    act(() => {
      result.current.onEndTimeChange(mockNewEndTime)
    })

    expect(result.current.selectedStartTime).toEqual(mockNewStartTime)
    expect(result.current.selectedEndTime).toEqual(mockNewEndTime)
    expect(result.current.startTimeChoices).toEqual(['09:00', '09:30', '10:00', '10:30'])
    expect(result.current.endTimeChoices).toEqual(['10:00', '10:30', '11:00'])
    expect(mockSetFilter).toBeCalledWith({
      ...mockSearchCourseQueryParams.filter,
      periodRange: { start: mockNewStartTime, end: mockNewEndTime },
    })

    const mockNewEndTime2 = '10:00'
    act(() => {
      result.current.onEndTimeChange(mockNewEndTime2)
    })

    expect(result.current.selectedStartTime).toEqual(mockNewStartTime)
    expect(result.current.selectedEndTime).toEqual(mockNewEndTime2)
    expect(result.current.startTimeChoices).toEqual(['09:00', '09:30', '10:00'])
    expect(result.current.endTimeChoices).toEqual(['10:00', '10:30', '11:00'])
    expect(mockSetFilter).toBeCalledWith({
      ...mockSearchCourseQueryParams.filter,
      periodRange: { start: mockNewStartTime, end: mockNewEndTime2 },
    })

    const mockNewStartTime2 = '09:00'
    act(() => {
      result.current.onStartTimeChange(mockNewStartTime2)
    })

    expect(result.current.selectedStartTime).toEqual(mockNewStartTime2)
    expect(result.current.selectedEndTime).toEqual(mockNewEndTime2)
    expect(result.current.startTimeChoices).toEqual(['09:00', '09:30', '10:00'])
    expect(result.current.endTimeChoices).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00'])
    expect(mockSetFilter).toBeCalledWith({
      ...mockSearchCourseQueryParams.filter,
      periodRange: { start: mockNewStartTime2, end: mockNewEndTime2 },
    })

    expect(mockSetFilter).toBeCalledTimes(4)
  })
})
