import CustomChip, { CustomChipProps } from '../'
import { GenEdChipKey } from '../config'

export type GenEdChipProps = CustomChipProps & {
  type: GenEdChipKey
}

const GenEdChip: React.FC<GenEdChipProps> = ({ type, ...props }) => <CustomChip type={type} {...props} />
export default GenEdChip
