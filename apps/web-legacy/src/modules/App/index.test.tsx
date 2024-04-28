import { shallow } from 'enzyme'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

describe('App module', () => {
  const mockRouter = vi.fn()
  const mockUseApp = vi.fn()
  const mockPageProps = { test: 'test' }
  const mockComponent = () => <div></div>
  const mockClient = vi.fn()
  const mockUseSaveStudyProgram = vi.fn()

  vi.doMock('./hooks/useApp', () => ({ useApp: mockUseApp }))
  vi.doMock('@web/common/hooks/useCourseGroup', () => ({
    useSaveStudyProgram: mockUseSaveStudyProgram,
  }))
  vi.doMock('@web/services/apollo', () => ({ client: mockClient }))

  const DEFAULT_ENV = process.env

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
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
  `(
    'Should app component render preperly when forceDark=$forceDark',
    async ({ forceDark, environment }) => {
      process.env.NEXT_PUBLIC_ENVIRONMENT = environment

      const { App } = await import('.')
      const { AppProvider } = await import('@web/modules/App/context')
      const { DefaultSeo } = await import('next-seo')
      const wrapper = shallow(
        <App
          forceDark={forceDark}
          Component={mockComponent}
          router={mockRouter as any}
          pageProps={mockPageProps}
        />
      )
      expect(mockUseApp).toBeCalledWith(mockRouter)
      expect(mockUseSaveStudyProgram).toBeCalledTimes(1)
      expect(wrapper.find(mockComponent).props()).toEqual(mockPageProps)
      expect(wrapper.find(AppProvider).prop('forceDark')).toBe(forceDark)
      expect(wrapper.find(DefaultSeo).prop('dangerouslySetAllPagesToNoFollow')).toBe(
        environment !== 'production'
      )
      expect(wrapper.find(DefaultSeo).prop('dangerouslySetAllPagesToNoIndex')).toBe(
        environment !== 'production'
      )
      expect(wrapper).toMatchSnapshot()
    }
  )
})
