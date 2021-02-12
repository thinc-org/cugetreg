/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from '@testing-library/react'
// import * as AppType from '@/pages/_app'
// import MyApp from '@/pages/_app'

describe('Index page', () => {
  const { default: Home } = require('@/pages/index')

  it('shoulde be able to create', () => {
    const chip = render(<Home />)
    expect(chip).toBeTruthy()
  })
})
