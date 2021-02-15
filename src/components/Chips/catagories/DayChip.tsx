import CustomChip from '..'
import { ChipProps } from '@material-ui/core'
import { ChipConfigProps, DayChipKey } from '../config'

export type DayChipProps = Omit<ChipProps, keyof ChipConfigProps> & {
  type: DayChipKey
}

const DayChip: React.FC<DayChipProps> = ({ type, ...props }) => <CustomChip type={type} {...props} />
export default DayChip
