import { GeneralChip, GeneralChipProps } from '..'
import { GenEdChipKey, OtherChipKey } from '../config'

export type AnnoucementChipProps = GeneralChipProps & {
  type: GenEdChipKey | OtherChipKey
}

export const AnnoucementChip: React.FC<AnnoucementChipProps> = ({ type, ...props }) => (
  <GeneralChip type={type} {...props} />
)
