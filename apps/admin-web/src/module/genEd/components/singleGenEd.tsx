import { Override } from '@cgr/codegen'
import { TableCell, TableRow } from '@mui/material'

interface SingleGenEdProps {
  data: Override
}

export default function SingleGenEd({ data }: SingleGenEdProps) {
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell scope="row" align="center">
        {data.academicYear}
      </TableCell>
      <TableCell align="center">{data.courseNo}</TableCell>
      <TableCell align="center">{data.genEd?.genEdType}</TableCell>
      <TableCell align="center">{data.semester}</TableCell>
      <TableCell align="center">{data.studyProgram}</TableCell>
    </TableRow>
  )
}
