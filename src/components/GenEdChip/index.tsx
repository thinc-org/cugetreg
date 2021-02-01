import { EnhancedChip } from './styles'
import { useTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core'
import { genedColorMapper } from './utils'
import { useTranslation } from 'react-i18next'

export interface GenedChipPropsType {
  category?: ChulaCourse.GenEdType
}

export const GenEdChip: React.FC<GenedChipPropsType> = ({ category }) => {
  const theme = useTheme<Theme>()
  const { t } = useTranslation('genEd')
  const BACKGROUND_COLOR = theme.palette.background.paper
  const color = genedColorMapper(theme, category)
  const genedType = category ? t(category) : t('NOT_GENED')

  return <EnhancedChip borderColor={color} backgroundColor={BACKGROUND_COLOR} textColor={color} category={genedType} />
}
