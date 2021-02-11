/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from '@testing-library/react'
// import * as AppType from '@/pages/_app'
// import MyApp from '@/pages/_app'

describe('Announcement page', () => {
  const { default: Announcement } = require('@/pages/announcement')

  it('shoulde be able to create', () => {
    const chip = render(<Announcement />)
    expect(chip).toBeTruthy()
  })
})
