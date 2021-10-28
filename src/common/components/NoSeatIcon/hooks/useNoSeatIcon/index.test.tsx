import { renderHook, act } from '@testing-library/react-hooks'
import { MouseEvent } from 'react'

describe('UseNoSeatNotice', () => {
  const I18N_NAME = 'regWarNotice'
  const LOG_NAME = 'regwarnotice'
  const LOG_ARGS = 'see notice'

  const mockTranslate = jest.fn()
  const mockUseTranslation = jest.fn(() => ({ t: mockTranslate }))
  const mockLog = jest.fn()
  const mockUseLog = jest.fn(() => ({ log: mockLog }))

  jest.doMock('react-i18next', () => ({
    useTranslation: mockUseTranslation,
  }))

  jest.doMock('@/common/context/Analytics/hooks/useLog', () => ({
    useLog: mockUseLog,
  }))

  it('Should use onHover and onLeave correctly', async () => {
    const { useNoSeatIcon } = await import('.')
    const { result } = renderHook(() => useNoSeatIcon())

    expect(mockUseTranslation).toBeCalledWith(I18N_NAME)
    expect(mockUseTranslation).toBeCalledTimes(1)
    expect(mockUseLog).toBeCalledWith(LOG_NAME)
    expect(mockUseLog).toBeCalledTimes(1)
    expect(result.current.anchorEl).toBe(null)
    expect(result.current.open).toBe(false)

    const mockElement = ((<div></div>) as any) as Element
    const mockMouseEvent = { currentTarget: mockElement }

    act(() => {
      result.current.onHover(mockMouseEvent as MouseEvent<HTMLButtonElement>)
    })

    expect(mockLog).toBeCalledWith(null, LOG_ARGS)
    expect(mockLog).toBeCalledTimes(1)
    expect(result.current.anchorEl).toBe(mockElement)
    expect(result.current.open).toBe(true)

    act(() => {
      result.current.onLeave()
    })

    expect(result.current.anchorEl).toBe(null)
    expect(result.current.open).toBe(false)
  })
})
