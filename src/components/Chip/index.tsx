import { useTheme } from '@material-ui/core'
import { ChipShade } from './const'
import { shadeMapper } from './utils'
import TemplateChip from '@/components/TemplateChip'

interface ChipPropsType {
  category: string
  className?: string
  shade: ChipShade
}

const Chip = ({ category, className, shade }: ChipPropsType) => {
  const theme = useTheme()
  const { textColor, backgroundColor } = shadeMapper(shade, theme)

  return (
    <TemplateChip className={className} textColor={textColor} backgroundColor={backgroundColor} category={category} />
  )
}

export default Chip
