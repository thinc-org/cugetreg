import { GeneralChip, GeneralChipProps } from '..'
import { GenEdChipKey } from '../config'

export type GenEdChipProps = GeneralChipProps & {
  type: GenEdChipKey
}

export const GenEdChip: React.FC<GenEdChipProps> = ({ type, ...props }) => (
  <GeneralChip type={type} {...props} />
)
