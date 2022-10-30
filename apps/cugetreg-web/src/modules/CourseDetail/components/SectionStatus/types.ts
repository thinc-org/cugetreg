import { TypographyProps } from '@mui/material'

import { Capacity } from '@cugetreg/codegen'

export type AvailableStatus = 'available' | 'full' | 'closed'
export interface SectionStatusProps extends TypographyProps {
  capacity: Capacity
  closed: boolean
}
