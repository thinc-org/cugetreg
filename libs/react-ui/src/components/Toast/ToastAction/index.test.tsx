import { shallow } from 'enzyme'

describe('ToastAction', () => {
  const mockChildren = <div>children</div>

  it('Should render correctly', async () => {
    const { ToastAction } = await import('.')
    const wrapper = shallow(<ToastAction>{mockChildren}</ToastAction>)

    expect(wrapper).toMatchSnapshot()
  })
})
