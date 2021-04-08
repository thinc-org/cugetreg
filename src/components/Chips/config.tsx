import { HighlightColor } from '@/configs/theme/palette'
import { ChipProps } from '@material-ui/core'
import { DayOfWeek, GenEdType } from '@thinc-org/chula-courses'

/*
 * This configuration file provide the Chip's types.
 * You add/remove the types by editing the `ChipKey` and `ChipConfig`.
 */

export interface ChipConfigProps {
  label: string
  color: HighlightColor
  variant?: ChipProps['variant']
}

export type GenEdChipKey = GenEdType
export type GenEdChipConfigProps = Record<GenEdType, ChipConfigProps>
export const genEdChipConfig: GenEdChipConfigProps = {
  SO: { label: 'หมวดสังคม', color: 'green', variant: 'outlined' },
  SC: { label: 'หมวดวิทย์', color: 'yellow', variant: 'outlined' },
  HU: { label: 'หมวดมนุษย์', color: 'pink', variant: 'outlined' },
  IN: { label: 'หมวดสหฯ', color: 'purple', variant: 'outlined' },
  NO: { label: 'ไม่ใช่ Gened', color: 'deepGray', variant: 'outlined' },
}

export type DayChipKey = DayOfWeek
export type DayChipConfigProps = Record<DayOfWeek, ChipConfigProps>
export const dayChipConfig: DayChipConfigProps = {
  MO: { label: 'วันจันทร์', color: 'yellow' },
  TU: { label: 'วันอังคาร', color: 'pink' },
  WE: { label: 'วันพุธ', color: 'green' },
  TH: { label: 'วันพฤหัสบดี', color: 'orange' },
  FR: { label: 'วันศุกร์', color: 'blue' },
  SA: { label: 'วันเสาร์', color: 'purple' },
  SU: { label: 'วันอาทิตย์', color: 'red' },
}

const createDefaultChipConfig: (label: string) => ChipConfigProps = (label: string) => ({
  label: label,
  color: 'deepGray',
})

export type OtherChipKey = 'open' | 'close' | 'chula' | 'other'
export type OtherChipConfigProps = Record<OtherChipKey, ChipConfigProps>
export const otherChipConfig: OtherChipConfigProps = {
  open: createDefaultChipConfig('เปิด'),
  close: createDefaultChipConfig('ปิด'),
  chula: createDefaultChipConfig('เกี่ยวกับจุฬาฯ'),
  other: createDefaultChipConfig('อื่น ๆ'),
  // Add more Chips here; don't forget to add key into `OtherChipKey` too
}

export type GeneralChipKey = GenEdChipKey | DayChipKey | OtherChipKey
export const chipConfig = {
  ...genEdChipConfig,
  ...dayChipConfig,
  ...otherChipConfig,
}
