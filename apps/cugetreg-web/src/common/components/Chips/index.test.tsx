import { DayOfWeek, GenEdType } from '@cugetreg/codegen'

import Chip from '@mui/material/Chip'
import { shallow } from 'enzyme'

import { GeneralChipProps } from '.'
import { GeneralChipKey } from './config'

describe('Chip', () => {
  it.each`
    value
    ${DayOfWeek.Mo}
    ${DayOfWeek.Tu}
    ${DayOfWeek.We}
    ${DayOfWeek.Th}
    ${DayOfWeek.Fr}
    ${DayOfWeek.Sa}
    ${DayOfWeek.Su}
  `(
    `should return chips with filled color, $value.label`,
    async ({ value }: { value: GeneralChipProps['type'] }) => {
      const { GeneralChip } = await import('.')

      const wrapper = shallow(<GeneralChip type={value} />)

      expect(wrapper.find(Chip)).toBeDefined()
      expect(wrapper.find(Chip).prop('variant')).not.toBeDefined()
      expect(wrapper).toMatchSnapshot()
    }
  )

  it.each`
    value
    ${GenEdType.So}
    ${GenEdType.Sc}
    ${GenEdType.Hu}
    ${GenEdType.In}
  `(
    `should return chips with outlined color, $value.label`,
    async ({ value }: { value: GeneralChipKey }) => {
      const { GeneralChip } = await import('.')

      const wrapper = shallow(<GeneralChip type={value} />)

      expect(wrapper.find(Chip)).toBeDefined()
      expect(wrapper.find(Chip).prop('variant')).toEqual('outlined')
      expect(wrapper).toMatchSnapshot()
    }
  )
})
