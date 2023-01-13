import { shallow } from 'enzyme'

describe('AnimatedIconWrapper', () => {
  const mockIcon = <div>icon</div>

  it('Should render correctly', async () => {
    const { AnimatedIconWrapper } = await import('.')
    const wrapper = shallow(<AnimatedIconWrapper>{mockIcon}</AnimatedIconWrapper>)

    expect(wrapper).toMatchSnapshot()
  })
})
