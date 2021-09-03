import { ChipProps } from '@material-ui/core'
import Chip from '@material-ui/core/Chip'

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

export const GeneralChip: React.FC<GeneralChipProps> = ({ type, ...rest }) => <Chip {...chipConfig[type]} {...rest} />
