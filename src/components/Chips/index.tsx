import { Chip, ChipProps } from '@material-ui/core'
import { chipConfig, ChipConfigProps, GeneralChipKey } from './config'

export type GeneralChipProps = Omit<ChipProps, keyof ChipConfigProps> & {
  type: GeneralChipKey
}

/**
 *  A Chip component used for the project.
 *  Also you can use Chip's props like the Mui-Chip except `color`, `variant` and `label`
 *  All override styles are in `scr/configs/theme/overrides/chips.ts`
 *  @param {GeneralChipKey} type - Tag's types that declare in `./cofing.ts`
 *  @description Overrided Chip Component; There are limited tag's types that declaring in `./config.ts`.
 */

const GeneralChip: React.FC<GeneralChipProps> = ({ type, className, ...rest }) => {
  const { color, variant, label } = chipConfig[type]
  return <Chip variant={variant} className={`${color} ${className ? className : ''}`} label={label} {...rest} />
}

export default GeneralChip
