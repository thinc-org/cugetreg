import { DayChipKey, GenEdChipKey, OtherChipKey } from '@/components/Chips/config'
import { CreateCheckbox } from '@/components/FilterBar/hooks'
import { DayOfWeekEnum } from '@/constants/dayOfWeek'
import { GenEdEnum } from '@/constants/genEd'

export const createGenEdCheckboxes: CreateCheckbox<GenEdChipKey>[] = [
  {
    label: 'หมวดวิทย์',
    value: GenEdEnum.SC,
  },
  {
    label: 'หมวดสังคม',
    value: GenEdEnum.SO,
  },
  {
    label: 'หมวดมนุษย์',
    value: GenEdEnum.HU,
  },
  {
    label: 'หมวดสหฯ',
    value: GenEdEnum.IN,
  },
  {
    label: 'ไม่ใช่ GenEd',
    value: GenEdEnum.NO,
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

export const createSpecialCheckboxes: CreateCheckbox<OtherChipKey>[] = [
  {
    label: 'เวลาไม่ชนกับวิชาที่เลือก',
    value: 'noConflict',
  },
]
