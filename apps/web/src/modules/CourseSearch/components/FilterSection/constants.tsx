import { CreateCheckbox } from '@web/modules/CourseSearch/components/FilterSection/hooks/useFilterBar'

import { DayOfWeek, GenEdType } from '@libs/codegen'
import { DayChipKey, GenEdChipKey } from '@libs/react-ui'

export const createGenEdCheckboxes: CreateCheckbox<GenEdChipKey>[] = [
  {
    label: 'หมวดวิทย์',
    value: GenEdType.Sc,
  },
  {
    label: 'หมวดสังคม',
    value: GenEdType.So,
  },
  {
    label: 'หมวดมนุษย์',
    value: GenEdType.Hu,
  },
  {
    label: 'หมวดสหฯ',
    value: GenEdType.In,
  },
  {
    label: 'ไม่ใช่ GenEd',
    value: GenEdType.No,
  },
]

export const createDayOfWeekCheckboxes: CreateCheckbox<DayChipKey>[] = [
  {
    label: 'วันจันทร์',
    value: DayOfWeek.Mo,
  },
  {
    label: 'วันอังคาร',
    value: DayOfWeek.Tu,
  },
  {
    label: 'วันพุธ',
    value: DayOfWeek.We,
  },
  {
    label: 'วันพฤหัสบดี',
    value: DayOfWeek.Th,
  },
  {
    label: 'วันศุกร์',
    value: DayOfWeek.Fr,
  },
  {
    label: 'วันเสาร์',
    value: DayOfWeek.Sa,
  },
  {
    label: 'วันอาทิตย์',
    value: DayOfWeek.Su,
  },
]
