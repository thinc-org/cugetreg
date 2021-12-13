import { TypographyProps } from '@mui/material'
import { Capacity } from '@thinc-org/chula-courses'

export type AvailableStatus = 'available' | 'full' | 'closed'
export interface SectionStatusProps extends TypographyProps {
  capacity: Capacity
  closed: boolean
}
