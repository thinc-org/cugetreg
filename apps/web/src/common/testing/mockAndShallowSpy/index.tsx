import { Mock, vi } from 'vitest'

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @deprecated please use shallow rendering instead
 */
export function mockAndShallowSpy(modulePath: string): [Mock<any, [props: any]>, () => void] {
  const componentSpy = vi.fn((props: any) => {
    const children = props?.children || modulePath

    return <div>{children}</div>
  })

  function resetComponentSpy() {
    componentSpy.mockClear()
  }

  vi.doMock(modulePath, () => componentSpy)

  return [componentSpy as any, resetComponentSpy]
}
