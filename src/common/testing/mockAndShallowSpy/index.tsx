// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * @deprecated please use shallow rendering instead
 */
export function mockAndShallowSpy(modulePath: string): [jest.Mock<JSX.Element, [props: any]>, () => void] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentSpy = jest.fn((props: any) => {
    const children = props?.children || modulePath

    return <div>{children}</div>
  })

  function resetComponentSpy() {
    componentSpy.mockClear()
  }

  jest.doMock(modulePath, () => componentSpy)

  return [componentSpy, resetComponentSpy]
}
