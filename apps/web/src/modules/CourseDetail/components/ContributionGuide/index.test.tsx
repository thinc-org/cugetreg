import { shallow } from 'enzyme'
import { describe, expect, it, vi } from 'vitest'

import { lightTheme } from '@web/configs/theme'

describe('ContributionGuide', () => {
  const useThemeSpy = vi.fn(() => lightTheme)

  vi.doMock('@mui/material', async () => ({
    ...((await vi.importActual('@mui/material')) as any),
    useTheme: useThemeSpy,
  }))

  it('should match snapshot', async () => {
    const { ContributionGuide } = await import('.')
    const wrapper = shallow(<ContributionGuide />)
    expect(wrapper).toMatchSnapshot()
  })
})
