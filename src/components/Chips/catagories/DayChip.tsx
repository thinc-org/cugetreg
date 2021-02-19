import CustomChip, { CustomChipProps } from '..'
import { DayChipKey } from '../config'

export type DayChipProps = CustomChipProps & {
  type: DayChipKey
}

const DayChip: React.FC<DayChipProps> = ({ type, ...props }) => <CustomChip type={type} {...props} />
export default DayChip
