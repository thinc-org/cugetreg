import { ThemeProvider } from '@mui/system'
import { shallow } from 'enzyme'
import { MdThumbUpOffAlt, MdThumbUp, MdThumbDownOffAlt, MdThumbDown } from 'react-icons/md'

import { ReviewInteractionType } from '@/common/types/reviews'
import { lightTheme } from '@/configs/theme'

import { ReviewReactionProps } from './types'

describe('ReviewReaction', () => {
  const mockProps: ReviewReactionProps = {
    type: ReviewInteractionType.Like,
    pressed: false,
    reactionCount: 42,
  }

  const useThemeSpy = jest.fn(() => lightTheme)

  jest.doMock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    useTheme: useThemeSpy,
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each`
    type                             | defaultPressed | expectedIcon
    ${ReviewInteractionType.Like}    | ${false}       | ${MdThumbUpOffAlt}
    ${ReviewInteractionType.Dislike} | ${false}       | ${MdThumbDownOffAlt}
    ${ReviewInteractionType.Like}    | ${true}        | ${MdThumbUp}
    ${ReviewInteractionType.Dislike} | ${true}        | ${MdThumbDown}
  `(
    'should render ReviewReaction type $type like correctly when defaultPressed=$defaultPressed ',
    async ({ type, expectedIcon, defaultPressed }) => {
      const { ReviewReaction } = await import('.')
      const wrapper = shallow(<ReviewReaction {...mockProps} type={type} pressed={defaultPressed} />, {
        wrappingComponent: ThemeProvider,
        wrappingComponentProps: { theme: lightTheme },
      })
      expect(wrapper.find(expectedIcon)).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    }
  )

  it.each`
    type                             | expectedUnpressedIcon | expectedPressedIcon
    ${ReviewInteractionType.Like}    | ${MdThumbUpOffAlt}    | ${MdThumbUp}
    ${ReviewInteractionType.Dislike} | ${MdThumbDownOffAlt}  | ${MdThumbDown}
  `(
    'should change icon when the component was clicked, type=$type',
    async ({ type, expectedUnpressedIcon, expectedPressedIcon }) => {
      const { ReviewReaction } = await import('.')
      const wrapper = shallow(<ReviewReaction {...mockProps} type={type} />, {
        wrappingComponent: ThemeProvider,
        wrappingComponentProps: { theme: lightTheme },
      })
      expect(wrapper.find(expectedUnpressedIcon)).toBeTruthy()
      wrapper.simulate('click')
      expect(wrapper.find(expectedPressedIcon)).toBeTruthy()
      wrapper.simulate('click')
      expect(wrapper.find(expectedUnpressedIcon)).toBeTruthy()
    }
  )
})