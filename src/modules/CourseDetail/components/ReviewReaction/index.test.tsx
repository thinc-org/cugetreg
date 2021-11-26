import { shallow } from 'enzyme'
import { MdThumbUpOffAlt, MdThumbUp, MdThumbDownOffAlt, MdThumbDown } from 'react-icons/md'

import { ReviewReactionProps, ReviewReactionType } from './types'

describe('ReviewReaction', () => {
  const mockProps: ReviewReactionProps = {
    type: ReviewReactionType.Like,
    defaultPressed: false,
    reactionCount: 42,
  }

  it.each`
    type                          | defaultPressed | expectedIcon
    ${ReviewReactionType.Like}    | ${false}       | ${MdThumbUpOffAlt}
    ${ReviewReactionType.Dislike} | ${false}       | ${MdThumbDownOffAlt}
    ${ReviewReactionType.Like}    | ${true}        | ${MdThumbUp}
    ${ReviewReactionType.Dislike} | ${true}        | ${MdThumbDown}
  `(
    'should render ReviewReaction type $type like correctly when defaultPressed=$defaultPressed ',
    async ({ type, expectedIcon, defaultPressed }) => {
      const { ReviewReaction } = await import('.')
      const wrapper = shallow(<ReviewReaction {...mockProps} type={type} defaultPressed={defaultPressed} />)
      expect(wrapper.find(expectedIcon)).toBeTruthy()
      expect(wrapper).toMatchSnapshot()
    }
  )

  it.each`
    type                          | expectedUnpressedIcon | expectedPressedIcon
    ${ReviewReactionType.Like}    | ${MdThumbUpOffAlt}    | ${MdThumbUp}
    ${ReviewReactionType.Dislike} | ${MdThumbDownOffAlt}  | ${MdThumbDown}
  `(
    'should change icon when the component was clicked, type=$type',
    async ({ type, expectedUnpressedIcon, expectedPressedIcon }) => {
      const { ReviewReaction } = await import('.')
      const wrapper = shallow(<ReviewReaction {...mockProps} type={type} />)
      expect(wrapper.find(expectedUnpressedIcon)).toBeTruthy()
      wrapper.simulate('click')
      expect(wrapper.find(expectedPressedIcon)).toBeTruthy()
      wrapper.simulate('click')
      expect(wrapper.find(expectedUnpressedIcon)).toBeTruthy()
    }
  )
})
