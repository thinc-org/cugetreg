import { Theme, useTheme } from '@material-ui/core'
import { EnhancedChip, useStyles } from './styles'

interface PropsType {
  textColor: string
  backgroundColor: string
  category: string
  className?: string
}

const ChipTemplate = ({ textColor, category, backgroundColor, className }: PropsType) => {
  const theme = useTheme<Theme>()
  const styles = useStyles()
  const padding = `${theme.spacing(0.25)}px ${theme.spacing(1)}px`

  return (
    <EnhancedChip
      className={`${className} ${styles.root}`}
      textColor={textColor}
      backgroundColor={backgroundColor}
      padding={padding}
      label={category}
    />
  )
}

export default ChipTemplate
