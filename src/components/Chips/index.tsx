import { Chip, ChipProps, makeStyles, Theme } from '@material-ui/core'
import { ChipConfig, ChipConfigProps, ChipKey, NecessaryChipProps } from './config'
import { highlightMapper } from './utils'

export type CustomChipProps = Omit<ChipProps, keyof NecessaryChipProps> & {
  type: ChipKey
}

const useStyles = makeStyles<Theme, ChipConfigProps>((theme) => ({
  root: {
    color: ({ color }) => highlightMapper(color, theme)[700],
    borderColor: ({ color, variant }) => (variant === 'outlined' ? highlightMapper(color, theme)[700] : 'none'),
    background: ({ color, variant }) =>
      variant === 'outlined' ? theme.palette.white : highlightMapper(color, theme)[300],
  },
}))

const CustomChip: React.FC<CustomChipProps> = (props) => {
  const { type, className, ...rest } = props
  const chipConfigProps = ChipConfig[type]
  const classes = useStyles(chipConfigProps)
  const { variant, label } = chipConfigProps

  return <Chip variant={variant} className={`${classes.root} ${className ? className : ''}`} label={label} {...rest} />
}

export default CustomChip
