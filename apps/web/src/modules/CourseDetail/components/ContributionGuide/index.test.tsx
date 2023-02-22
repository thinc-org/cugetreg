import { lightTheme } from '@web/configs/theme'
import { shallow } from 'enzyme'

describe('ContributionGuide', () => {
  const useThemeSpy = jest.fn(() => lightTheme)

  jest.doMock('@mui/material', () => ({
    ...(jest.requireActual('@mui/material') as any),
    useTheme: useThemeSpy,
  }))

  it('should match snapshot', async () => {
    const { ContributionGuide } = await import('.')
    const wrapper = shallow(<ContributionGuide />)
    expect(wrapper).toMatchSnapshot()
  })
})
