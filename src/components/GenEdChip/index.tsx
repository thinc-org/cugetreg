import { EnhancedChip } from './styles'
import { useTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core'
import { GenEd } from '@/utils/types'
import { genedColorMapper } from './utils'
import { useTranslation } from 'react-i18next'

interface GenedChipPropsType {
  category: GenEd
}

const GenedChip = ({ category }: GenedChipPropsType) => {
  const theme = useTheme<Theme>()
  const { t } = useTranslation('genEd')
  const BACKGROUND_COLOR = theme.palette.background.paper
  const color = genedColorMapper(category, theme)

  return (
    <EnhancedChip borderColor={color} backgroundColor={BACKGROUND_COLOR} textColor={color} category={t(category)} />
  )
}

export default GenedChip
