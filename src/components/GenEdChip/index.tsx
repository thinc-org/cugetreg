import { EnhancedChip } from './styles'
import { Theme, useTheme } from '@material-ui/core'
import { genedColorMapper } from './utils'
import { useTranslation } from 'react-i18next'
import { GenEdType } from '@thinc-org/chula-courses'

export interface GenedChipPropsType {
  category: GenEdType
}

export const GenEdChip: React.FC<GenedChipPropsType> = ({ category }) => {
  const theme = useTheme<Theme>()
  const { t } = useTranslation('genEd')
  const BACKGROUND_COLOR = theme.palette.background.paper
  const color = genedColorMapper(theme, category)
  const genedType = t(category)

  return <EnhancedChip borderColor={color} backgroundColor={BACKGROUND_COLOR} textColor={color} category={genedType} />
}
