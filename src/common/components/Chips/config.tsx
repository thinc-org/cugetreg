import { ChipProps } from '@mui/material'
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
export type GenEdChipConfigProps = Record<GenEdChipKey, ChipConfigProps>
export const genEdChipConfig: GenEdChipConfigProps = {
  SO: { label: 'หมวดสังคม', color: 'greenOutlined', variant: 'outlined' },
  SC: { label: 'หมวดวิทย์', color: 'yellowOutlined', variant: 'outlined' },
  HU: { label: 'หมวดมนุษย์', color: 'pinkOutlined', variant: 'outlined' },
  IN: { label: 'หมวดสหฯ', color: 'purpleOutlined', variant: 'outlined' },
  NO: { label: 'ไม่ใช่ Gened', color: 'deepGrayOutlined', variant: 'outlined' },
}

export type DayChipKey = DayOfWeek
export type DayChipConfigProps = Record<DayChipKey, ChipConfigProps>
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

export enum OtherEnum {
  open = 'open',
  close = 'close',
  reviewPending = 'reviewPending',
  reviewRejected = 'reviewRejected',
  chula = 'chula',
  other = 'other',
}
export type OtherChipKey = keyof typeof OtherEnum
export type OtherChipConfigProps = Record<OtherChipKey, ChipConfigProps>
export const otherChipConfig: OtherChipConfigProps = {
  open: createDefaultChipConfig('เปิด'),
  close: createDefaultChipConfig('ปิด'),
  reviewPending: { label: 'รอการอนุมัติ', color: 'yellowFilled' },
  reviewRejected: { label: 'ไม่ได้รับการอนุมัติ', color: 'redFilled' },
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
