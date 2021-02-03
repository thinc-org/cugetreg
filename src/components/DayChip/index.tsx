import { Theme, useTheme } from '@material-ui/core'
import { DayOfWeek } from '@thinc-org/chula-courses'
import { useTranslation } from 'react-i18next'
import TemplateChip from '../TemplateChip'
import { dayColorMapper } from './utils'

export interface DayChipProps {
  category: DayOfWeek
}

export const DayChip = (props: DayChipProps) => {
  const { category } = props
  const theme = useTheme<Theme>()
  const { t } = useTranslation('dayOfWeek')
  return <TemplateChip {...dayColorMapper(theme, category)} category={t(category)} />
}
