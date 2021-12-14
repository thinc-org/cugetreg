import { Table, TableProps } from '@mui/material'

import { deepAssign } from '@/common/utils/deepAssign'

export function UnstyledTable({ sx, ...props }: TableProps) {
  return (
    <Table
      sx={deepAssign(
        {
          width: { xs: '100%', sm: 'auto' },
          'td, th': { border: 0, p: 0 },
          td: { verticalAlign: 'top' },
          'td ~ td, th ~ th': {
            pl: { xs: 2, sm: 5 },
          },
        },
        sx
      )}
      {...props}
    />
  )
}
