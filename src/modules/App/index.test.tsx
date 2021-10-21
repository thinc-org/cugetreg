import { shallow } from 'enzyme'

describe('App module', () => {
  const mockRouter = jest.fn()
  const mockUseApp = jest.fn()
  const mockPageProps = { test: 'test' }
  const mockComponent = () => <div></div>
  const mockClient = jest.fn()
  jest.doMock('./hooks/useApp', () => ({ useApp: mockUseApp }))
  jest.doMock('@/services/apollo', () => ({ client: mockClient }))

  const DEFAULT_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...DEFAULT_ENV }
  })

  afterAll(() => {
    process.env = DEFAULT_ENV
  })

  it.each`
    forceDark | environment
    ${true}   | ${'dev'}
    ${true}   | ${'beta'}
    ${true}   | ${'production'}
    ${false}  | ${'dev'}
    ${false}  | ${'beta'}
    ${false}  | ${'production'}
  `('Should app component render preperly when forceDark=$forceDark', async ({ forceDark, environment }) => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = environment

    const { App } = await import('.')
    const { AppProvider } = await import('@/modules/App/context')
    const { DefaultSeo } = await import('next-seo')
    const wrapper = shallow(
      <App forceDark={forceDark} Component={mockComponent} router={mockRouter as any} pageProps={mockPageProps} />
    )
    expect(mockUseApp).toBeCalledWith(mockRouter)
    expect(wrapper.find(mockComponent).props()).toEqual(mockPageProps)
    expect(wrapper.find(AppProvider).prop('forceDark')).toBe(false)
    expect(wrapper.find(DefaultSeo).prop('dangerouslySetAllPagesToNoFollow')).toBe(environment !== 'production')
    expect(wrapper.find(DefaultSeo).prop('dangerouslySetAllPagesToNoIndex')).toBe(environment !== 'production')
    expect(wrapper).toMatchSnapshot()
  })
})
