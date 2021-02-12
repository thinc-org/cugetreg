/* eslint-disable @typescript-eslint/no-var-requires */
import renderWithTheme from '@/../__test__/utils/renderWithTheme'

describe('Announcement page', () => {
  const { default: Announcement } = require('@/pages/announcement')

  it('shoulde be able to create', () => {
    const chip = renderWithTheme(<Announcement />)
    expect(chip).toBeTruthy()
  })
})
