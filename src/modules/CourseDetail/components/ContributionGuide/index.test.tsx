import { Alert, IconButton } from '@mui/material'
import { shallow } from 'enzyme'

import { lightTheme } from '@/configs/theme'

describe('ContributionGuide', () => {
  const useThemeSpy = jest.fn(() => lightTheme)

  jest.doMock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useTheme: useThemeSpy,
  }))

  it('should match snapshot', async () => {
    const { ContributionGuide } = await import('.')
    const wrapper = shallow(<ContributionGuide />)
    expect(wrapper).toMatchSnapshot()
  })
})
