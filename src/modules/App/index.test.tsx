import { shallow } from 'enzyme'

describe('App module', () => {
  const mockRouter = jest.fn()
  const mockUseApp = jest.fn()
  const mockPageProps = { test: 'test' }
  const mockComponent = () => <div></div>
  const mockClient = jest.fn()
  jest.doMock('./hooks/useApp', () => ({ useApp: mockUseApp }))
  jest.doMock('@/services/apollo', () => ({ client: mockClient }))

  it.each`
    forceDark
    ${true}
    ${false}
  `('Should app component render preperly when forceDark=$forceDark', async ({ forceDark }) => {
    const { App } = await import('.')
    const { AppProvider } = await import('@/modules/App/context')
    const wrapper = shallow(
      <App forceDark={forceDark} Component={mockComponent} router={mockRouter as any} pageProps={mockPageProps} />
    )
    expect(mockUseApp).toBeCalledWith(mockRouter)
    expect(wrapper.find(mockComponent).props()).toEqual(mockPageProps)
    expect(wrapper.find(AppProvider).prop('forceDark')).toBe(forceDark)
    expect(wrapper).toMatchSnapshot()
  })
})
