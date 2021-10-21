import { renderHook, act } from '@testing-library/react-hooks'
import { MouseEvent } from 'react'

describe('UseNoSeatNotice', () => {
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

    expect(mockUseTranslation).toBeCalledWith('regWarNotice')
    expect(mockUseTranslation).toBeCalledTimes(1)
    expect(mockUseLog).toBeCalledWith('regwarnotice')
    expect(mockUseLog).toBeCalledTimes(1)

    expect(result.current.anchorEl).toBe(null)

    const mockElement = ((<div></div>) as any) as Element
    const mockMouseEvent = { currentTarget: mockElement }

    act(() => {
      result.current.onHover(mockMouseEvent as MouseEvent<HTMLButtonElement>)
    })

    expect(mockLog).toBeCalledWith(null, 'see notice')
    expect(mockLog).toBeCalledTimes(1)
    expect(result.current.anchorEl).toBe(mockElement)

    act(() => {
      result.current.onLeave()
    })

    expect(result.current.anchorEl).toBe(null)
  })
})
