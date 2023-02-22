import { MdThumbDown, MdThumbDownOffAlt, MdThumbUp, MdThumbUpOffAlt } from 'react-icons/md'

import { ThemeProvider } from '@mui/material'
import { lightTheme } from '@web/configs/theme'
import { shallow } from 'enzyme'

import { ReviewInteractionType } from '@cgr/codegen'

import { ReviewReactionProps } from './types'

describe('ReviewReaction', () => {
  const mockProps: ReviewReactionProps = {
    type: ReviewInteractionType.L,
    pressed: false,
    reactionCount: 42,
  }

  const useThemeSpy = jest.fn(() => lightTheme)

  jest.doMock('@mui/material', () => ({
    ...(jest.requireActual('@mui/material') as any),
    useTheme: useThemeSpy,
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each`
    type                       | defaultPressed | expectedIcon
    ${ReviewInteractionType.L} | ${false}       | ${MdThumbUpOffAlt}
    ${ReviewInteractionType.D} | ${false}       | ${MdThumbDownOffAlt}
    ${ReviewInteractionType.L} | ${true}        | ${MdThumbUp}
    ${ReviewInteractionType.D} | ${true}        | ${MdThumbDown}
  `(
    'should render ReviewReaction type $type like correctly when defaultPressed=$defaultPressed ',
    async ({ type, expectedIcon, defaultPressed }) => {
      const { ReviewReaction } = await import('.')
      const wrapper = shallow(
        <ReviewReaction {...mockProps} type={type} pressed={defaultPressed} />,
        {
          wrappingComponent: ThemeProvider,
          wrappingComponentProps: { theme: lightTheme },
        }
      )
      expect(wrapper.find(expectedIcon)).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    }
  )

  it.each`
    type                       | expectedUnpressedIcon | expectedPressedIcon
    ${ReviewInteractionType.L} | ${MdThumbUpOffAlt}    | ${MdThumbUp}
    ${ReviewInteractionType.D} | ${MdThumbDownOffAlt}  | ${MdThumbDown}
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
