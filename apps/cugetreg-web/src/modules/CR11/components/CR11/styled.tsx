import { TableCell } from '@mui/material'

import { withTypography } from '@web/common/hoc/withTypography'

export const Column = withTypography((props) => <TableCell {...props} />)
export const ColumnHeader = withTypography((props) => <TableCell component="th" {...props} />)
