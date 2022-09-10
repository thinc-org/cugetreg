import { Capacity } from '@cugetreg/codegen'

import { TypographyProps } from '@mui/material'

export type AvailableStatus = 'available' | 'full' | 'closed'
export interface SectionStatusProps extends TypographyProps {
  capacity: Capacity
  closed: boolean
}
