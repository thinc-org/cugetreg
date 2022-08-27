import { Capacity } from '@thinc-org/chula-courses'
import { shallow } from 'enzyme'

describe('SectionStatus', () => {
  const mockCapacity: Capacity = {
    current: 100,
    max: 150,
  }
  const mockFullCapacity: Capacity = {
    current: 151,
    max: 150,
  }

  it.each`
    closed   | capacity
    ${false} | ${mockCapacity}
    ${false} | ${mockFullCapacity}
    ${true}  | ${mockCapacity}
    ${true}  | ${mockFullCapacity}
  `("Should match snapshot correctly'", async ({ closed, capacity }) => {
    const { SectionStatus } = await import('.')

    const wrapper = shallow(<SectionStatus capacity={capacity} closed={closed} />)
    expect(wrapper).toMatchSnapshot()
  })
})
