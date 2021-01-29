import Chip from '@/components/Chip'
import { styled, Theme } from '@material-ui/core'

interface EnhancedChipProps {
  borderColor: string
}

export const EnhancedChip = styled(Chip)<Theme, EnhancedChipProps>({
  padding: '1px 12px',
  boxSizing: 'border-box',
  border: ({ borderColor }) => `1px solid ${borderColor}`,
})
