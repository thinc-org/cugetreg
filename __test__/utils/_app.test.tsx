/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from '@testing-library/react'
// import * as AppType from '@/pages/_app'
// import MyApp from '@/pages/_app'

describe('App component', () => {
  const useAppSpy = jest.fn()

  jest.doMock('@/hooks/useApp', () => useAppSpy)

  const { default: App } = require('@/pages/_app')
  const MOCK_COMPONENT = () => <div></div>
  const MOCK_PROPS = { Component: MOCK_COMPONENT, pageProps: {}, forceDark: true }

  it('shoulde be able to create', () => {
    const chip = render(<App {...MOCK_PROPS} />)
    expect(chip).toBeTruthy()
  })
})
