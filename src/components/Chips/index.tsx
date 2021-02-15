import { Chip, ChipProps } from '@material-ui/core'
import { ChipConfig, ChipConfigProps, ChipKey } from './config'

export type CustomChipProps = Omit<ChipProps, keyof ChipConfigProps> & {
  type: ChipKey
}

/**
 *  A Chip component used for the project.
 *  Also you can use Chip's `props` like the Mui-Chip except `color`, `variant` and `label`
 *  All override styles are in `scr/configs/theme/overrides/chips.ts`
 *  @param {ChipKey} type - Tag's types that declare in `./cofing.ts`
 *  @description Override Chip Component; There are limited tag's types that declaring in `./config.ts`.
 */

const CustomChip: React.FC<CustomChipProps> = ({ type, className, ...rest }) => {
  const { color, variant, label } = ChipConfig[type]
  return <Chip variant={variant} className={`${color} ${className ? className : ''}`} label={label} {...rest} />
}

export default CustomChip
