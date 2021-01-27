import { EnhancedChip } from './styles'

interface PropsType {
  color: string
  category: string
}

const GenedChip = ({ color, category }: PropsType) => {
  const BACKGROUND_COLOR = '#FFFFFF'
  return <EnhancedChip borderColor={color} backgroundColor={BACKGROUND_COLOR} textColor={color} category={category} />
}

export default GenedChip
