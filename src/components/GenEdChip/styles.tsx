import Chip from '@/components/Chip'
import { styled } from '@material-ui/core'

interface EnhancedChipProps {
  borderColor: string
}

export const EnhancedChip = styled(Chip)({
  padding: '1px 12px',
  boxSizing: 'border-box',
  border: ({ borderColor }: EnhancedChipProps) => `1px solid ${borderColor}`,
})
