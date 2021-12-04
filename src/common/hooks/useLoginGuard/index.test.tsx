import { act, renderHook } from '@testing-library/react-hooks'
import { shallow } from 'enzyme'

describe('useLoginGuard', () => {
  const isLoggedInSpy = jest.fn()

  jest.doMock('@/store/userStore', () => ({
    userStore: {
      isLoggedIn: isLoggedInSpy,
    },
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return true if user is logged in', async () => {
    isLoggedInSpy.mockReturnValue(true)

    const { useLoginGuard } = await import('.')
    const { result } = renderHook(() => useLoginGuard())

    const { loginGuard } = result.current

    let isLoggedIn
    act(() => {
      isLoggedIn = loginGuard()
    })
    expect(isLoggedIn).toBeTruthy()
  })

  it('should return false and open dialog if user is not logged in', async () => {
    isLoggedInSpy.mockReturnValue(false)

    const { useLoginGuard } = await import('.')
    const { result, rerender } = renderHook(() => useLoginGuard())

    let isLoggedIn
    act(() => {
      isLoggedIn = result.current.loginGuard()
    })
    expect(isLoggedIn).toBeFalsy()

    const Dialog = result.current.Dialog
    const wrapper = shallow(<Dialog />)
    expect(wrapper.props().open).toBeTruthy()
  })
})
