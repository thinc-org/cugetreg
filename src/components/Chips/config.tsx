import { HighlightColor } from '@/configs/theme/palette'
import { ChipProps } from '@material-ui/core'
import { DayOfWeek, GenEdType } from '@thinc-org/chula-courses'

export interface ChipConfigProps {
  label: string
  color: HighlightColor
  variant: ChipProps['variant']
}

export type GenEdChipKey = GenEdType
export type GenEdChipConfigProps = Record<GenEdType, ChipConfigProps>
export const GenEdChipConfig: GenEdChipConfigProps = {
  SO: { label: 'หมวดสังคม', color: 'green', variant: 'outlined' },
  SC: { label: 'หมวดวิทย์', color: 'yellow', variant: 'outlined' },
  HU: { label: 'หมวดมนุษย์', color: 'pink', variant: 'outlined' },
  IN: { label: 'หมวดสหฯ', color: 'purple', variant: 'outlined' },
  NO: { label: 'ไม่ใช่ Gened', color: 'deepGray', variant: 'outlined' },
}

export type DayChipKey = DayOfWeek
export type DayChipConfigProps = Record<DayOfWeek, ChipConfigProps>
export const DayChipConfig: DayChipConfigProps = {
  MO: { label: 'วันจันทร์', color: 'yellow', variant: 'default' },
  TU: { label: 'วันอังคาร', color: 'pink', variant: 'default' },
  WE: { label: 'วันพุธ', color: 'green', variant: 'default' },
  TH: { label: 'วันพฤหัสบดี', color: 'orange', variant: 'default' },
  FR: { label: 'วันศุกร์', color: 'blue', variant: 'default' },
  SA: { label: 'วันเสาร์', color: 'purple', variant: 'default' },
  SU: { label: 'วันอาทิตย์', color: 'red', variant: 'default' },
}

const createDefaultChipConfig: (label: string) => ChipConfigProps = (label: string) => ({
  label: label,
  color: 'deepGray',
  variant: 'default',
})

export type OtherChipKey = 'open' | 'close' | 'chula' | 'other'
export type OtherChipConfigProps = Record<OtherChipKey, ChipConfigProps>
export const OtherChipConfig: OtherChipConfigProps = {
  open: createDefaultChipConfig('เปิด'),
  close: createDefaultChipConfig('ปิด'),
  chula: createDefaultChipConfig('เกี่ยวกับจุฬาฯ'),
  other: createDefaultChipConfig('อื่น ๆ'),
  // Add more Chips here; don't forget to add key into `OtherChipKey` too
}

export type ChipKey = GenEdChipKey | DayChipKey | OtherChipKey
export const ChipConfig = {
  ...GenEdChipConfig,
  ...DayChipConfig,
  ...OtherChipConfig,
}
