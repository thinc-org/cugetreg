import { EnhancedChip } from './styles'
import { useTheme } from '@material-ui/styles'
import { ThemeType } from '@/configs/theme'

interface PropsType {
  color: string
  category: string
}

const GenedChip = ({ color, category }: PropsType) => {
  const theme = useTheme<ThemeType>()
  const BACKGROUND_COLOR = theme.palette.background.paper

  return <EnhancedChip borderColor={color} backgroundColor={BACKGROUND_COLOR} textColor={color} category={category} />
}

export default GenedChip
