import CustomChip from '../'
import { ChipProps } from '@material-ui/core'
import { ChipConfigProps, GenEdChipKey } from '../config'

export type GenEdChipProps = Omit<ChipProps, keyof ChipConfigProps> & {
  type: GenEdChipKey
}

const GenEdChip: React.FC<GenEdChipProps> = ({ type, ...props }) => <CustomChip type={type} {...props} />
export default GenEdChip
