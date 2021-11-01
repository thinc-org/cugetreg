import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'

describe('useSelectTime', () => {
  const setFilterSpy = jest.fn()
  const useSearchCourseQueryParamsSpy = jest.fn()
  const mockGeneratedTime = ['09:00', '09:30', '10:00', '10:30', '11:00']
  const generateTimeAroundSpy = jest.fn(() => mockGeneratedTime)
  jest.doMock('@/modules/CourseSearch/hooks/useSearchCourseQueryParams', () => ({
    useSearchCourseQueryParams: useSearchCourseQueryParamsSpy,
  }))
  jest.doMock('../../utils/generateTimeAround', () => ({
    generateTimeAround: generateTimeAroundSpy,
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockDefaultStartTime = '09:00'
  const mockDefaultEndTime = '11:00'

  it('Should get start time and end time from query param if not available and set checked to false', async () => {
    const { useSelectTime } = await import('.')

    const mockSearchCourseQueryParams = { filter: { a: 'a' } }
    useSearchCourseQueryParamsSpy.mockImplementationOnce(() => ({
      setFilter: setFilterSpy,
      searchCourseQueryParams: mockSearchCourseQueryParams,
    }))
    const { result } = renderHook(() => useSelectTime(mockDefaultStartTime, mockDefaultEndTime))

    expect(result.current.selectedStartTime).toEqual(mockDefaultStartTime)
    expect(result.current.selectedEndTime).toEqual(mockDefaultEndTime)
    expect(result.current.startTimeChoices).toEqual(mockGeneratedTime)
    expect(result.current.endTimeChoices).toEqual(mockGeneratedTime)
    expect(result.current.checked).toBe(false)

    expect(generateTimeAroundSpy).toHaveBeenCalledWith(mockDefaultStartTime, mockDefaultEndTime)
    expect(generateTimeAroundSpy).toHaveBeenCalledWith(mockDefaultStartTime, mockDefaultEndTime)
    expect(generateTimeAroundSpy).toHaveBeenCalledTimes(2)
  })

  it('Should get start time and end time from query param if available and set checked to true', async () => {
    const { useSelectTime } = await import('.')

    const mockStartTime = '10:00'
    const mockEndTime = '17:00'
    const mockSearchCourseQueryParams = { filter: { a: 'a', periodRange: { start: mockStartTime, end: mockEndTime } } }
    useSearchCourseQueryParamsSpy.mockImplementationOnce(() => ({
      setFilter: setFilterSpy,
      searchCourseQueryParams: mockSearchCourseQueryParams,
    }))
    const { result } = renderHook(() => useSelectTime(mockDefaultStartTime, mockDefaultEndTime))

    expect(result.current.selectedStartTime).toEqual(mockStartTime)
    expect(result.current.selectedEndTime).toEqual(mockEndTime)
    expect(result.current.startTimeChoices).toEqual(mockGeneratedTime)
    expect(result.current.endTimeChoices).toEqual(mockGeneratedTime)
    expect(result.current.checked).toBe(true)

    expect(generateTimeAroundSpy).toHaveBeenCalledWith(mockDefaultStartTime, mockEndTime)
    expect(generateTimeAroundSpy).toHaveBeenCalledWith(mockStartTime, mockDefaultEndTime)
    expect(generateTimeAroundSpy).toHaveBeenCalledTimes(2)
  })

  it('Should invoke onStartTimeChange correctly', async () => {
    const { useSelectTime } = await import('.')

    const mockSearchCourseQueryParams = { filter: { a: 'a' } }
    useSearchCourseQueryParamsSpy.mockImplementationOnce(() => ({
      setFilter: setFilterSpy,
      searchCourseQueryParams: mockSearchCourseQueryParams,
    }))
    const { result } = renderHook(() => useSelectTime(mockDefaultStartTime, mockDefaultEndTime))

    const mockNewStartTime = '10:00'
    act(() => {
      result.current.onStartTimeChange({ target: { value: mockNewStartTime } } as any)
    })

    expect(setFilterSpy).toBeCalledWith({
      ...mockSearchCourseQueryParams.filter,
      periodRange: { start: mockNewStartTime, end: mockDefaultEndTime },
    })
  })

  it('Should invoke onEndTimeChange correctly', async () => {
    const { useSelectTime } = await import('.')

    const mockSearchCourseQueryParams = { filter: { a: 'a' } }
    useSearchCourseQueryParamsSpy.mockImplementationOnce(() => ({
      setFilter: setFilterSpy,
      searchCourseQueryParams: mockSearchCourseQueryParams,
    }))
    const { result } = renderHook(() => useSelectTime(mockDefaultStartTime, mockDefaultEndTime))

    const mockNewEndTime = '12:00'
    act(() => {
      result.current.onEndTimeChange({ target: { value: mockNewEndTime } } as any)
    })

    expect(setFilterSpy).toBeCalledWith({
      ...mockSearchCourseQueryParams.filter,
      periodRange: { start: mockDefaultStartTime, end: mockNewEndTime },
    })
  })

  it('Should invoke onCheckboxChange correctly', async () => {
    const { useSelectTime } = await import('.')

    const mockSearchCourseQueryParams = { filter: { a: 'a' } }
    useSearchCourseQueryParamsSpy.mockImplementationOnce(() => ({
      setFilter: setFilterSpy,
      searchCourseQueryParams: mockSearchCourseQueryParams,
    }))
    const { result } = renderHook(() => useSelectTime(mockDefaultStartTime, mockDefaultEndTime))

    const mockEvent = { target: { checked: true } }
    act(() => {
      result.current.onCheckboxChange(mockEvent as React.ChangeEvent<HTMLInputElement>)
    })

    expect(setFilterSpy).toHaveBeenNthCalledWith(1, {
      ...mockSearchCourseQueryParams.filter,
      periodRange: { start: mockDefaultStartTime, end: mockDefaultEndTime },
    })

    const mockEvent2 = { target: { checked: false } }
    act(() => {
      result.current.onCheckboxChange(mockEvent2 as React.ChangeEvent<HTMLInputElement>)
    })

    expect(setFilterSpy).toHaveBeenNthCalledWith(2, {
      ...mockSearchCourseQueryParams.filter,
      periodRange: undefined,
    })

    expect(setFilterSpy).toBeCalledTimes(2)
  })
})
