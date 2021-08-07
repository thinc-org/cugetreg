import { ChipProps } from '@material-ui/core'
import { DayOfWeek, GenEdType } from '@thinc-org/chula-courses'

import { ChipFilledHighlightColor, ChipOutlinedHighlightColor } from '@/configs/theme/overrides/chip'

/*
 * This configuration file provide the Chip's types.
 * You add/remove the types by editing the `ChipKey` and `ChipConfig`.
 */

export interface ChipConfigProps {
  label: string
  color: ChipFilledHighlightColor | ChipOutlinedHighlightColor
  variant?: ChipProps['variant']
}

const createDefaultChipConfig = (label: string): ChipConfigProps => ({
  label,
  color: 'deepGrayFilled',
})

export type GenEdChipKey = GenEdType
export type GenEdChipConfigProps = Record<GenEdType, ChipConfigProps>
export const genEdChipConfig: GenEdChipConfigProps = {
  SO: { label: 'หมวดสังคม', color: 'greenOutlined', variant: 'outlined' },
  SC: { label: 'หมวดวิทย์', color: 'yellowOutlined', variant: 'outlined' },
  HU: { label: 'หมวดมนุษย์', color: 'pinkOutlined', variant: 'outlined' },
  IN: { label: 'หมวดสหฯ', color: 'purpleOutlined', variant: 'outlined' },
  NO: { label: 'ไม่ใช่ Gened', color: 'deepGrayOutlined', variant: 'outlined' },
}

export type DayChipKey = DayOfWeek
export type DayChipConfigProps = Record<DayOfWeek, ChipConfigProps>
export const dayChipConfig: DayChipConfigProps = {
  MO: { label: 'วันจันทร์', color: 'yellowFilled' },
  TU: { label: 'วันอังคาร', color: 'pinkFilled' },
  WE: { label: 'วันพุธ', color: 'greenFilled' },
  TH: { label: 'วันพฤหัสบดี', color: 'orangeFilled' },
  FR: { label: 'วันศุกร์', color: 'blueFilled' },
  SA: { label: 'วันเสาร์', color: 'purpleFilled' },
  SU: { label: 'วันอาทิตย์', color: 'redFilled' },
  IA: createDefaultChipConfig('IA'),
  AR: createDefaultChipConfig('AR'),
}

export type OtherChipKey = 'open' | 'close' | 'chula' | 'other' | 'noConflict'
export type OtherChipConfigProps = Record<OtherChipKey, ChipConfigProps>
export const otherChipConfig: OtherChipConfigProps = {
  open: createDefaultChipConfig('เปิด'),
  close: createDefaultChipConfig('ปิด'),
  chula: createDefaultChipConfig('เกี่ยวกับจุฬาฯ'),
  other: createDefaultChipConfig('อื่น ๆ'),
  noConflict: createDefaultChipConfig('เวลาไม่ชนกับวิชาที่เลือก'),
  // Add more Chips here; don't forget to add key into `OtherChipKey` too
}

export type GeneralChipKey = GenEdChipKey | DayChipKey | OtherChipKey
export const chipConfig = {
  ...genEdChipConfig,
  ...dayChipConfig,
  ...otherChipConfig,
}
