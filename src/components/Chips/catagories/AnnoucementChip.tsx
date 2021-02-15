import CustomChip from '..'
import { ChipProps } from '@material-ui/core'
import { ChipConfigProps, GenEdChipKey, OtherChipKey } from '../config'

export type AnnoucementChipProps = Omit<ChipProps, keyof ChipConfigProps> & {
  type: GenEdChipKey | OtherChipKey
}

const AnnoucementChip: React.FC<AnnoucementChipProps> = ({ type, ...props }) => <CustomChip type={type} {...props} />
export default AnnoucementChip
