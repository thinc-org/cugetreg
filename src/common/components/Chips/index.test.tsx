import Chip from '@material-ui/core/Chip'
import { GenEdTypeEnum, DayOfWeekEnum } from '@thinc-org/chula-courses'
import { shallow } from 'enzyme'

import { GeneralChipProps } from '.'
import { GeneralChipKey } from './config'

describe('Chip', () => {
  it.each`
    value
    ${DayOfWeekEnum.Monday}
    ${DayOfWeekEnum.Tuesday}
    ${DayOfWeekEnum.Wednesday}
    ${DayOfWeekEnum.Thursday}
    ${DayOfWeekEnum.Friday}
    ${DayOfWeekEnum.Saturday}
    ${DayOfWeekEnum.Sunday}
  `(`should return chips with filled color, $value.label`, async ({ value }: { value: GeneralChipProps['type'] }) => {
    const { GeneralChip } = await import('.')

    const wrapper = shallow(<GeneralChip type={value} />)

    expect(wrapper.find(Chip)).toBeDefined()
    expect(wrapper.find(Chip).prop('variant')).not.toBeDefined()
    expect(wrapper).toMatchSnapshot()
  })

  it.each`
    value
    ${GenEdTypeEnum.SO}
    ${GenEdTypeEnum.SC}
    ${GenEdTypeEnum.HU}
    ${GenEdTypeEnum.IN}
  `(`should return chips with outlined color, $value.label`, async ({ value }: { value: GeneralChipKey }) => {
    const { GeneralChip } = await import('.')

    const wrapper = shallow(<GeneralChip type={value} />)

    expect(wrapper.find(Chip)).toBeDefined()
    expect(wrapper.find(Chip).prop('variant')).toEqual('outlined')
    expect(wrapper).toMatchSnapshot()
  })
})
