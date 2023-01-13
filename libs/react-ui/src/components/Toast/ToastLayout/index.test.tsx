import { shallow } from 'enzyme'

describe('ToastLayout', () => {
  const mockChildren = <div>children</div>
  const mockAction = <div>action</div>

  it('Should render correctly', async () => {
    const { ToastLayout } = await import('.')
    const wrapper = shallow(<ToastLayout actions={mockAction}>{mockChildren}</ToastLayout>)

    expect(wrapper).toMatchSnapshot()
  })
})
