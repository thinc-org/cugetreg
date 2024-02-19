import { MouseEvent } from 'react'

import { act, renderHook } from '@testing-library/react-hooks'
import { describe, expect, it, vi } from 'vitest'

describe('UseNoSeatNotice', () => {
  const I18N_NAME = 'regWarNotice'
  const LOG_NAME = 'regwarnotice'
  const LOG_ARGS = 'see notice'

  const mockTranslate = vi.fn()
  const mockUseTranslation = vi.fn(() => ({ t: mockTranslate }))
  const mockLog = vi.fn()
  const mockUseLog = vi.fn(() => ({ log: mockLog }))

  vi.doMock('react-i18next', () => ({
    useTranslation: mockUseTranslation,
  }))

  vi.doMock('@web/common/context/Analytics/hooks/useLog', () => ({
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

    const mockElement = (<div></div>) as any as Element
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
