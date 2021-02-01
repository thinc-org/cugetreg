import { Theme, useTheme } from '@material-ui/core'
import { EnhancedChip, useStyles } from './styles'

interface PropsType {
  textColor: string
  backgroundColor: string
  category: string
  className?: string
}

const TemplateChip = ({ textColor, category, backgroundColor, className }: PropsType) => {
  const theme = useTheme<Theme>()
  const styles = useStyles()
  const padding = theme.spacing(0.25, 1)

  return (
    <EnhancedChip
      className={`${className} ${styles.root}`}
      textcolor={textColor}
      backgroundcolor={backgroundColor}
      padding={padding}
      label={category}
    />
  )
}

export default TemplateChip
