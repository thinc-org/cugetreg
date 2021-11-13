import { TableCell } from '@material-ui/core'

import { withTypography } from '@/common/hoc/withTypography'

export const Column = withTypography((props) => <TableCell {...props} />)
export const ColumnHeader = withTypography((props) => <TableCell component="th" {...props} />)
