import GeneralChip, { GeneralChipProps } from '../'
import { GenEdChipKey } from '../config'

export type GenEdChipProps = GeneralChipProps & {
  type: GenEdChipKey
}

const GenEdChip: React.FC<GenEdChipProps> = ({ type, ...props }) => <GeneralChip type={type} {...props} />
export default GenEdChip
