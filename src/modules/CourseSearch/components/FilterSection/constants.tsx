import { DayOfWeekEnum, GenEdTypeEnum } from '@thinc-org/chula-courses'

import { DayChipKey, GenEdChipKey } from '@/common/components/Chips/config'
import { CreateCheckbox } from '@/modules/CourseSearch/components/FilterSection/hooks/useFilterBar'

export const createGenEdCheckboxes: CreateCheckbox<GenEdChipKey>[] = [
  {
    label: 'หมวดวิทย์',
    value: GenEdTypeEnum.SC,
  },
  {
    label: 'หมวดสังคม',
    value: GenEdTypeEnum.SO,
  },
  {
    label: 'หมวดมนุษย์',
    value: GenEdTypeEnum.HU,
  },
  {
    label: 'หมวดสหฯ',
    value: GenEdTypeEnum.IN,
  },
  {
    label: 'ไม่ใช่ GenEd',
    value: GenEdTypeEnum.NO,
  },
]

export const createDayOfWeekCheckboxes: CreateCheckbox<DayChipKey>[] = [
  {
    label: 'วันจันทร์',
    value: DayOfWeekEnum.Monday,
  },
  {
    label: 'วันอังคาร',
    value: DayOfWeekEnum.Tuesday,
  },
  {
    label: 'วันพุธ',
    value: DayOfWeekEnum.Wednesday,
  },
  {
    label: 'วันพฤหัสบดี',
    value: DayOfWeekEnum.Thursday,
  },
  {
    label: 'วันศุกร์',
    value: DayOfWeekEnum.Friday,
  },
  {
    label: 'วันเสาร์',
    value: DayOfWeekEnum.Saturday,
  },
  {
    label: 'วันอาทิตย์',
    value: DayOfWeekEnum.Sunday,
  },
]
