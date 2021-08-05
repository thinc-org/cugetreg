import { renderHook, act } from '@testing-library/react-hooks'

import { TrackingAction, TrackingCategory } from './constants'
import { useGoogleTrackerProps } from './types'

describe('useGoogleTracker', () => {
  const mockTrackCategory = TrackingCategory.CLICK
  const mockTrackAction = TrackingAction.SELECT_COURSE

  const defaultProps: useGoogleTrackerProps = {
    category: mockTrackCategory,
    action: mockTrackAction,
  }

  const trackEventSpy = jest.fn()

  jest.doMock('react-ga', () => ({
    event: trackEventSpy,
  }))

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return track function', async () => {
    const useGoogleTracker = (await import('.')).default

    const { result } = renderHook(() => useGoogleTracker(defaultProps))

    act(() => result.current())

    expect(trackEventSpy).toBeCalledTimes(1)
    expect(trackEventSpy).toBeCalledWith(defaultProps)
  })
})
