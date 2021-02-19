import CustomChip, { CustomChipProps } from '..'
import { GenEdChipKey, OtherChipKey } from '../config'

export type AnnoucementChipProps = CustomChipProps & {
  type: GenEdChipKey | OtherChipKey
}

const AnnoucementChip: React.FC<AnnoucementChipProps> = ({ type, ...props }) => <CustomChip type={type} {...props} />
export default AnnoucementChip
